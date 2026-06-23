require('dotenv').config();
const db = require('./config/db');
const ProductModel = require('./models/productModel');

const asicsUrls = [
  "https://images.unsplash.com/photo-1571741590149-a29f00898167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1575456632743-a868c5743aa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1602504786849-b325e183168b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1708088641654-531c89605597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1575456571326-2a5c7478aeb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1575456456278-936c89ccdb7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YXNpY3MlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762943107238-a87f6f7bf6a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGFzaWNzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
];

const pumaUrls = [
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1603787081151-cbebeef20092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1638210344400-df90e4453303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1665664652230-05ff263914a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1664303352277-29bdc562bd89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1664476059639-65239a7dce4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8cHVtYSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1664478168285-d6d1d78cb963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHB1bWElMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

const adidasUrls = [
  "https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1593287073863-c992914cb3e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1723773743655-71e6b5961089?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8YWRpZGFzJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGFkaWRhcyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
];

const nbUrls = [
  "https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680204101489-2c1319c872b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1727173962205-0fbd64580eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1610630879511-3f6a23c19a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1559745206-ca4056293ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1714158508782-dc8393449f7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1677360678353-64f775206260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bmV3JTIwYmFsYW5jZSUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzQzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1738951878885-407c329b80eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fG5ldyUyMGJhbGFuY2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
];

const converseUrls = [
  "https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1562105962-2fbaaf107fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1633303518517-60c15527ebdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1726279243973-e7323b28cf6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1665664652418-91f260a84842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680729369987-f8fbdf58f01d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1627361673902-c80df14aecdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1556048219-bb6978360b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://plus.unsplash.com/premium_photo-1697385274482-72b74eb39f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y29udmVyc2UlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODc0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680204101108-d1bf3a7c725d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNvbnZlcnNlJTIwc2hvZXN8ZW58MHx8fHwxNzgyMTg3NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
];

const newProducts = {
  "Adidas": [
    { nama: "Adidas Samba OG", kategori: "Sneakers", harga: 1699000 },
    { nama: "Adidas Gazelle", kategori: "Sneakers", harga: 1599000 },
    { nama: "Adidas Stan Smith", kategori: "Sneakers", harga: 1499000 },
    { nama: "Adidas Ultraboost 1.0", kategori: "Running", harga: 2999000 },
    { nama: "Adidas Superstar", kategori: "Sneakers", harga: 1499000 },
    { nama: "Adidas NMD_R1", kategori: "Sneakers", harga: 2299000 },
    { nama: "Adidas Forum Low", kategori: "Sneakers", harga: 1699000 },
    { nama: "Adidas Ozelia", kategori: "Sneakers", harga: 1899000 },
    { nama: "Adidas Campus 00s", kategori: "Sneakers", harga: 1799000 },
    { nama: "Adidas Yeezy Boost 350", kategori: "Sneakers", harga: 3899000 }
  ],
  "New Balance": [
    { nama: "New Balance 550", kategori: "Sneakers", harga: 2199000 },
    { nama: "New Balance 990v6", kategori: "Running", harga: 3499000 },
    { nama: "New Balance 2002R", kategori: "Sneakers", harga: 2599000 },
    { nama: "New Balance 574 Core", kategori: "Sneakers", harga: 1499000 },
    { nama: "New Balance 1906R", kategori: "Sneakers", harga: 2799000 },
    { nama: "New Balance 327", kategori: "Sneakers", harga: 1899000 },
    { nama: "New Balance Fresh Foam X", kategori: "Running", harga: 2699000 },
    { nama: "New Balance 9060", kategori: "Sneakers", harga: 2899000 },
    { nama: "New Balance 993", kategori: "Running", harga: 3599000 },
    { nama: "New Balance 530", kategori: "Sneakers", harga: 1699000 }
  ],
  "Converse": [
    { nama: "Converse Chuck Taylor", kategori: "Sneakers", harga: 899000 },
    { nama: "Converse Chuck 70", kategori: "Sneakers", harga: 1199000 },
    { nama: "Converse Run Star Hike", kategori: "Sneakers", harga: 1599000 },
    { nama: "Converse One Star", kategori: "Sneakers", harga: 1299000 },
    { nama: "Converse Jack Purcell", kategori: "Sneakers", harga: 1099000 },
    { nama: "Converse Weapon CX", kategori: "Sneakers", harga: 1499000 },
    { nama: "Converse Platform", kategori: "Sneakers", harga: 1399000 },
    { nama: "Converse Star Player 76", kategori: "Sneakers", harga: 1299000 },
    { nama: "Converse Chuck 70 Plus", kategori: "Sneakers", harga: 1499000 },
    { nama: "Converse Pro Leather", kategori: "Sneakers", harga: 1399000 }
  ]
};

async function fixAll() {
  await new Promise(r => setTimeout(r, 2000));
  try {
    // 1. Fix Puma
    const [pumaRows] = await db.query("SELECT id, nama FROM products WHERE brand = 'Puma'");
    for (let i = 0; i < pumaRows.length; i++) {
      const prod = pumaRows[i];
      await db.query("UPDATE products SET gambar = :gambar WHERE id = :id", { gambar: pumaUrls[i % pumaUrls.length], id: prod.id });
    }
    console.log("Fixed Puma images!");

    // 2. Fix Asics
    const [asicsRows] = await db.query("SELECT id, nama FROM products WHERE brand = 'Asics'");
    for (let i = 0; i < asicsRows.length; i++) {
      const prod = asicsRows[i];
      await db.query("UPDATE products SET gambar = :gambar WHERE id = :id", { gambar: asicsUrls[i % asicsUrls.length], id: prod.id });
    }
    console.log("Fixed Asics images!");

    // 3. Add New Brands and Products
    const brandsToAdd = ["Adidas", "New Balance", "Converse"];
    const logos = {
      "Adidas": "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      "New Balance": "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
      "Converse": "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg"
    };

    for (const b of brandsToAdd) {
      // Check if brand exists
      const [bRows] = await db.query("SELECT id FROM brands WHERE nama = :nama", { nama: b });
      if (bRows.length === 0) {
        await db.query("INSERT INTO brands (nama, logo) VALUES (:nama, :logo)", { nama: b, logo: logos[b] });
        console.log("Inserted brand: " + b);
      }
    }

    const sizes = [39, 40, 41, 42, 43, 44];
    
    // Insert Adidas
    for (let i = 0; i < newProducts["Adidas"].length; i++) {
      const prod = newProducts["Adidas"][i];
      const productId = await ProductModel.create({ ...prod, brand: "Adidas", deskripsi: "Original Adidas " + prod.nama, gambar: adidasUrls[i] });
      for (const s of sizes) await ProductModel.addSize(productId, s, Math.floor(Math.random() * 20) + 5);
    }
    
    // Insert New Balance
    for (let i = 0; i < newProducts["New Balance"].length; i++) {
      const prod = newProducts["New Balance"][i];
      const productId = await ProductModel.create({ ...prod, brand: "New Balance", deskripsi: "Original New Balance " + prod.nama, gambar: nbUrls[i] });
      for (const s of sizes) await ProductModel.addSize(productId, s, Math.floor(Math.random() * 20) + 5);
    }

    // Insert Converse
    for (let i = 0; i < newProducts["Converse"].length; i++) {
      const prod = newProducts["Converse"][i];
      const productId = await ProductModel.create({ ...prod, brand: "Converse", deskripsi: "Original Converse " + prod.nama, gambar: converseUrls[i] });
      for (const s of sizes) await ProductModel.addSize(productId, s, Math.floor(Math.random() * 20) + 5);
    }

    console.log("All brands fixed and inserted successfully!");
    process.exit(0);

  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fixAll();
