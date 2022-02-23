const newUserEmail = {
    emailId: 'new-user-email',
    variables: ['username'],
    fromName: 'Beacon JS',
    defaultEmail: {
        subject: 'New account registered',
        text: `
Welcome
-------

Your new account has been registered.
- Username: $[username]

You can either [login]($[mainBeaconUrl]) or if you don't have a password,  
you can [create a new password]($[newPassUrl]) for you.

<a href="$[mainBeaconUrl]" target="_blank" style="padding: 8px 12px 7px; border: 1px solid #555;border-radius: 8px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;background: #333;">
    Login
</a>

Do not reply to this email, thank you.

/BeaconJs`,
    },
    langs: {
        fi: {
            subject: 'Uusi tili rekisteröity',
            text: `
Tervetuloa
----------

Uusi tilinne on rekisteröity.
- Käyttäjänimi: $[username]

Voit joko [kirjautua sisään]($[mainBeaconUrl]) tai jos sinulla ei ole salasanaa,  
voit luoda [uuden salasanan]($[newPassUrl]) itsellesi.

<a href="$[mainBeaconUrl]" target="_blank" style="padding: 8px 12px 7px; border: 1px solid #555;border-radius: 8px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;background: #333;">
    Kirjaudu
</a>

Älkää vastatko tähän sähköpostiin, kiitos.

/BeaconJs`,
        },
    },
};

module.exports = newUserEmail;