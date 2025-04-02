import axios from "axios";
import Markdown from "react-markdown";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const About = () => {
  const { data: readme } = useSWR("/md/about.md", fetcher, {
    onError: (error) => console.error(error)
  });

  return (
    <Markdown className='no-reset mx-auto max-w-3xl text-lg'>{readme}</Markdown>
  );
};

export default About;
