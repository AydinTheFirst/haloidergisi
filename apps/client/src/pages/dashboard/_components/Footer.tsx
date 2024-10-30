import { Card } from "@nextui-org/react";

export const Footer = () => {
  return (
    <Card className="p-3" radius="none">
      <div className="flex justify-between">
        <p>
          <strong>Yönetim Paneli</strong>
        </p>
        <p>
          <strong>Version:</strong> 1.0.0
        </p>
      </div>
    </Card>
  );
};
