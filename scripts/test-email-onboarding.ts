import { Resend } from 'resend';

// Using the API key found in .env.local
const resend = new Resend('re_LDgqvf1F_GPrGqVjt5ANZ6gdnj7ydCVxh');

async function test() {
    console.log('Sending test email to negraodenio@gmail.com using onboarding@resend.dev...');
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Changed to Resend default for unverified domains
            to: 'negraodenio@gmail.com',
            subject: '🔥 Test: Your Roast is Unlocked!',
            html: `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #222; border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
        
        <!-- Header -->
        <div style="padding: 40px; text-align: center; background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);">
            <h1 style="margin: 0; color: #ff4500; font-size: 28px; font-weight: 900; letter-spacing: -1px;">🔥 ROASTY</h1>
            <div style="margin-top: 20px; display: inline-block; padding: 10px 20px; background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 50px; color: #22c55e; font-size: 14px; font-weight: bold;">
                PAYMENT SUCCESSFUL
            </div>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; text-align: center;">
            <h2 style="font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 15px; letter-spacing: -0.5px;">You're in, Denio!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #aaa; margin-bottom: 35px;">
                Your payment of <strong>9,99€</strong> for the <strong>Single Roast Report</strong> was successful. 
                The full audit for <strong>https://your-site.com</strong> is now unlocked.
            </p>
            
            <!-- Button -->
            <div style="margin-bottom: 40px;">
                <a href="https://roastthis.site/dashboard" 
                   style="display: inline-block; background-color: #ffffff; color: #000000; padding: 18px 45px; font-size: 16px; font-weight: 900; text-decoration: none; border-radius: 12px; transition: all 0.2s ease;">
                   VIEW YOUR DASHBOARD
                </a>
            </div>

            <div style="padding: 20px; border-radius: 12px; background-color: #111; border: 1px solid #222; text-align: left;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #555; text-transform: uppercase; font-weight: 900; tracking-widest: 1px;">Summary</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #888; font-size: 14px;">Product:</span>
                    <span style="color: #fff; font-size: 14px; font-weight: bold;">Single Roast Report</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #888; font-size: 14px;">Amount:</span>
                    <span style="color: #fff; font-size: 14px; font-weight: bold;">9,99€</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="padding: 30px; text-align: center; border-top: 1px solid #222; background-color: #050505;">
            <p style="margin: 0; font-size: 12px; color: #444;">
                Roasty AI &copy; 2026. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
            `
        });
        if (error) {
            console.error('Error from Resend:', error);
        } else {
            console.log('Email sent successfully!', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

test();
