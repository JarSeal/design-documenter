const verifyAccountEmail = {
    emailId: 'verify-account-email',
    fromName: 'Beacon JS',
    defaultEmail: {
        subject: 'Verify account email',
        text: `
Almost there, $[username], please verify your E-mail
----------------------------------------------------

Please verify your account's E-mail by clicking this link:

<a href="$[verifyEmailTokenUrl]" target="_blank" style="padding: 8px 32px 7px; border: 1px solid #555;border-radius: 8px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;background: #333;">
    Verify
</a>

Link: $[verifyEmailTokenUrl]

If you do not own this account, you can ignore this message.

Do not reply to this email, thank you.

/Beacon JS`,
    },
    langs: {},
};

module.exports = verifyAccountEmail;
