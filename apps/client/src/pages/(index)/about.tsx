import type { MetaFunction } from "react-router";

import axios from "axios";
import Markdown from "react-markdown";
import useSWR from "swr";

export const meta: MetaFunction = () => {
  return [
    { title: "HALO Dergisi | Hakkında" },
    { content: "HALO Dergisi Hakkında", name: "description" }
  ];
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const About = () => {
  const { data: readme } = useSWR("/md/about.md", fetcher, {
    onError: (error) => console.error(error)
  });

  return (
    <div className='container my-10 max-w-3xl'>
      <div className='no-reset text-lg'>
        <Markdown>{readme}</Markdown>
      </div>
    </div>
  );
};

export default About;
