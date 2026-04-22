export const generateVCard = (card) => {
  const { profile, contact, social } = card;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile?.name || ''}`,
    profile?.jobTitle ? `TITLE:${profile.jobTitle}` : null,
    profile?.company ? `ORG:${profile.company}` : null,
    contact?.phone ? `TEL;TYPE=CELL:${contact.phone}` : null,
    contact?.email ? `EMAIL:${contact.email}` : null,
    contact?.website ? `URL:${contact.website}` : null,
    contact?.whatsapp ? `X-WHATSAPP:${contact.whatsapp}` : null,
    social?.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${social.linkedin}` : null,
    social?.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${social.twitter}` : null,
    social?.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${social.instagram}` : null,
    social?.github ? `X-SOCIALPROFILE;TYPE=github:${social.github}` : null,
    profile?.photo ? `PHOTO;VALUE=URI:${profile.photo}` : null,
    profile?.bio ? `NOTE:${profile.bio}` : null,
    'END:VCARD',
  ];

  return lines.filter(Boolean).join('\r\n');
};
