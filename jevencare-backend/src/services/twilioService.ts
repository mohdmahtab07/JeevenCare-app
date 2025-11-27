// Mock OTP service for development/testing
// Replace with real Twilio implementation in production

const otpStore = new Map<string, { code: string; expiry: number }>();

// Generate random 6-digit OTP (use fixed '123456' for testing)
const generateOTP = (): string => {
  // For testing: always return '123456'
  return "123456";

  // For production: use random OTP
  // return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phone: string): Promise<boolean> => {
  try {
    // Format phone number to E.164 format (e.g., +919876543210)
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    // Generate OTP
    const otp = generateOTP();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store OTP in memory
    otpStore.set(formattedPhone, { code: otp, expiry });

    console.log(`✅ OTP sent to ${formattedPhone}`);
    console.log(`🔔 [DEVELOPMENT] OTP Code: ${otp}`); // Remove this in production

    return true;
  } catch (error: any) {
    console.error("❌ OTP send error:", error.message);
    return false;
  }
};

export const verifyOTP = async (
  phone: string,
  code: string
): Promise<boolean> => {
  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    // Get stored OTP
    const stored = otpStore.get(formattedPhone);

    if (!stored) {
      console.log("❌ No OTP found for this number");
      return false;
    }

    // Check if OTP expired
    if (Date.now() > stored.expiry) {
      console.log("❌ OTP expired");
      otpStore.delete(formattedPhone);
      return false;
    }

    // Check if OTP matches
    if (stored.code !== code) {
      console.log("❌ Invalid OTP");
      return false;
    }

    // OTP is valid - remove from store
    otpStore.delete(formattedPhone);
    console.log("✅ OTP verified successfully");
    return true;
  } catch (error: any) {
    console.error("❌ OTP verify error:", error.message);
    return false;
  }
};
