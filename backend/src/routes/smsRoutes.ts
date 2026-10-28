import { Router, Request, Response } from 'express';

const smsRouter = Router();

smsRouter.post('/send', async (req: Request, res: Response) => {
  const { phone, message, config } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, message: 'Phone and message are required.' });
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const provider = config?.provider || 'textbelt';

  try {
    // Provider 1: Fast2SMS (India)
    if (provider === 'fast2sms' && config?.apiKey) {
      const indianNumber = cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone.slice(2) : cleanPhone;
      const f2sRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': config.apiKey.trim()
        },
        body: JSON.stringify({
          route: 'q',
          message: String(message).slice(0, 150),
          language: 'english',
          flash: 0,
          numbers: indianNumber
        })
      });

      const data = await f2sRes.json();
      if (data.return) {
        return res.json({ success: true, provider: 'Fast2SMS', messageId: data.request_id });
      } else {
        return res.status(400).json({ success: false, error: data.message });
      }
    }

    // Provider 2: Twilio
    if (provider === 'twilio' && config?.twilioAccountSid && config?.twilioAuthToken && config?.twilioFromPhone) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid.trim()}/Messages.json`;
      const auth = Buffer.from(`${config.twilioAccountSid.trim()}:${config.twilioAuthToken.trim()}`).toString('base64');
      const formData = new URLSearchParams();
      formData.append('To', '+' + cleanPhone);
      formData.append('From', config.twilioFromPhone.trim());
      formData.append('Body', message);

      const twilioRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const twData = await twilioRes.json();
      if (twilioRes.ok && twData.sid) {
        return res.json({ success: true, provider: 'Twilio', messageId: twData.sid });
      } else {
        return res.status(400).json({ success: false, error: twData.message });
      }
    }

    // Provider 3: TextBelt (Default Global Free)
    const tbRes = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        message,
        key: config?.apiKey || 'textbelt'
      })
    });

    const tbData = await tbRes.json();
    if (tbData.success) {
      return res.json({ success: true, provider: 'TextBelt', messageId: tbData.textId });
    } else {
      return res.status(400).json({ success: false, error: tbData.error });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Internal SMS proxy error.' });
  }
});

export default smsRouter;
