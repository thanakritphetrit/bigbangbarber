import QRCode from 'qrcode';

/**
 * Calculate CRC16 CCITT for EMVCo standard PromptPay QR
 */
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) & 0xff) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Format tag-length-value (TLV) for EMVCo QR Code
 */
function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Generate official PromptPay QR payload string
 * @param target Mobile number (e.g. 0812345678) or National/Tax ID (13 digits)
 * @param amount Optional transaction amount in THB
 */
export function generatePromptPayPayload(target: string, amount?: number): string {
  // Strip non-digits
  const cleanTarget = target.replace(/[^0-9]/g, '');

  let targetFormatted = cleanTarget;
  let subTag = '01'; // 01 for phone, 02 for national ID

  if (cleanTarget.length === 10 && cleanTarget.startsWith('0')) {
    // Mobile number: convert 08x to 00668x
    targetFormatted = '0066' + cleanTarget.substring(1);
    subTag = '01';
  } else if (cleanTarget.length === 9) {
    targetFormatted = '0066' + cleanTarget;
    subTag = '01';
  } else if (cleanTarget.length === 13) {
    // National ID or Tax ID
    targetFormatted = cleanTarget;
    subTag = '02';
  }

  // Sub tags for PromptPay (Merchant Account Info - 29)
  const aid = formatTLV('00', 'A000000677010111');
  const targetTag = formatTLV(subTag, targetFormatted);
  const merchantAccountInfo = formatTLV('29', aid + targetTag);

  // Payload segments
  const version = formatTLV('00', '01');
  const initiation = formatTLV('01', amount !== undefined && amount > 0 ? '12' : '11');
  const country = formatTLV('58', 'TH');
  const currency = formatTLV('53', '764'); // THB currency code

  let payload = version + initiation + merchantAccountInfo + country + currency;

  if (amount !== undefined && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    payload += formatTLV('54', formattedAmount);
  }

  // Checksum tag placeholder
  const checksumPrefix = '6304';
  const checksum = crc16(payload + checksumPrefix);

  return payload + checksumPrefix + checksum;
}

/**
 * Generate PromptPay QR Code as base64 Data URL
 */
export async function generatePromptPayQRDataUrl(
  target: string,
  amount?: number
): Promise<string> {
  try {
    const payload = generatePromptPayPayload(target || '0891234567', amount);
    const dataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#0A0A0B',
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate PromptPay QR:', error);
    // Fallback simple QR
    return await QRCode.toDataURL(`https://promptpay.io/${target.replace(/[^0-9]/g, '')}/${amount || ''}`);
  }
}
