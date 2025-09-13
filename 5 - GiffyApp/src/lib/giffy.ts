export const fetchGif = async (query:string , limit:number) => {
    const api = import.meta.env.VITE_GIF_API;

    const url = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${api}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.data;
}