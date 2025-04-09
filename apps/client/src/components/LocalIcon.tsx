interface IconProps {
  key: string;
  url: string;
}

const icons: IconProps[] = [
  { key: "instagram", url: "/icons/instagram.svg" },
  { key: "linkedin", url: "/icons/linkedin.svg" }
];

interface LocalIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: (typeof icons)[number]["key"];
}

export const LocalIcon = (props: LocalIconProps) => {
  const { name, ...rest } = props;

  const icon = icons.find((icon) => icon.key === name);

  if (!icon) {
    return null;
  }

  return (
    <img
      alt={name}
      className='h-6 w-6'
      src={icon.url}
      {...rest}
    />
  );
};
