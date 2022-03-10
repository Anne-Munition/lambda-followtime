const getUser = {
  data: [
    {
      id: '59351240',
      login: 'dbkynd',
      display_name: 'DBKynd',
      type: '',
      broadcaster_type: '',
      description: '',
      profile_image_url:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/a6e849ab-32ec-4696-8363-914a66e673da-profile_image-300x300.png',
      offline_image_url: '',
      view_count: 1639,
      created_at: '2014-03-21T21:09:04Z',
    },
  ],
};

const getFollow = {
  total: 1,
  data: [
    {
      from_id: '59351240',
      from_login: 'dbkynd',
      from_name: 'DBKynd',
      to_id: '51533859',
      to_login: 'annemunition',
      to_name: 'AnneMunition',
      followed_at: '2021-05-20T22:12:02Z',
    },
  ],
  pagination: {},
};

module.exports = {
  getUser,
  getFollow,
};
