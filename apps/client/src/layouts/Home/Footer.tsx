import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <div className="border-t bg-slate-100 shadow-lg">
      <div className="flex justify-center p-5">
        <div className="col-md-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-3xl font-bold">Halo Dergisi</h1>
            <h3 className="text-lg font-semibold">
              Aylık Fikir, Sanat ve Edebiyat Dergisi
            </h3>
            <p>
              Bölümümüze ve öğrencilerine katkı sağlamak amacıyla, diğer
              fakülteler dahil olmak üzere; ortaya bir fikir- edebiyat dergisi
              sunmak için bir araya gelmiş bir grup öğrenciyiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
