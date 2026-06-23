const axios = require('axios');
axios.patch('http://localhost:3000/api/orders/2/status', { status: 'shipped' }, {
  headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN || 'dummy'}` }
}).then(console.log).catch(e => console.error(e.response ? e.response.data : e.message));
