const fetchUrls = async () => {
  try {
    const q = 'site:stockx.com "Nike Air Force 1 Low"';
    const html = await fetch('https://www.bing.com/images/search?q=' + encodeURIComponent(q)).then(r => r.text());
    const matches = [...html.matchAll(/murl&quot;:&quot;(https:\/\/[^&]+)&quot;/g)];
    for(let i=0; i<Math.min(3, matches.length); i++) {
      console.log(matches[i][1]);
    }
  } catch(e) { console.log(e); }
};
fetchUrls();
