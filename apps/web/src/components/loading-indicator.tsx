import { useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";

import useLoaderStore from "@/store/loader-store";

export default function LoadingIndicator() {
  const router = useRouterState();
  const isFetching = useLoaderStore((state) => state.isLoading);

  if (router.status === "idle" && !isFetching) return null;

  return (
    <div className='fixed top-0 left-0 z-100 h-1 w-full overflow-hidden bg-blue-100'>
      <motion.div
        className='h-full bg-blue-600'
        style={{ width: "30%" }} // Çubuğun genişliği
        initial={{ x: "-100%" }}
        animate={{ x: "400%" }} // Ekranın dışına kadar sür
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
