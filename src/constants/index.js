const fetcher = (url) => fetch(url).then((res) => res.json());

const tagUrl = "https://tagomio.github.io/goms/tags.json";
const gomUrl = "https://tagomio.github.io/goms/goms.json";

export { fetcher, tagUrl, gomUrl };
