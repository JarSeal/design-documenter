const newPassLinkEmail = {
    emailId: 'new-pass-link-email',
    fromName: 'Beacon JS',
    defaultEmail: {
        subject: 'Reset Password Link',
        text: `
Your Link is Ready, $[username]
---------------------------

You requested a link to reset your password. Here you go:

<a href="$[mainBeaconUrl]" target="_blank" style="padding: 8px 32px 7px; border: 1px solid #555;border-radius: 8px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;background: #333;">
    Reset my password
</a>

If you did not request this, you can ignore this message (only you have this message). This link will expire in $[linkLife] minutes.

Do not reply to this email, thank you.

/Beacon JS`,
    },
    langs: {},
};

module.exports = newPassLinkEmail;