import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUploadSuccess?: (url: string) => void;
}

export default function FileInput({ className, onUploadSuccess, value, ...props }: FileInputProps) {
  const [fileUrl, setFileUrl] = React.useState<string>(String(value || ""));
  const [progress, setProgress] = React.useState<AxiosProgressEvent | null>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setFileUrl(String(value));
    }
  }, [value]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: setProgress,
      });

      return data;
    },
    onSuccess: (url) => {
      setFileUrl(url);
      onUploadSuccess?.(url);
      toast.success("Dosya yüklendi!");
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message);
    },
    onSettled: () => {
      setProgress(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const loadedPercent = Math.round(((progress?.loaded ?? 0) / (progress?.total ?? 1)) * 100);

  return (
    <div className='relative w-full space-y-2'>
      <input
        type='hidden'
        value={fileUrl}
        name={props.name}
      />

      <div className='relative'>
        <Input
          type='file'
          disabled={uploadMutation.isPending}
          className={cn("pr-10", className)}
          onChange={handleFileChange}
          {...props}
          value={undefined}
        />
        <div className='absolute top-1/2 right-3 -translate-y-1/2'>
          {uploadMutation.isPending && <Spinner className='size-5' />}
          {fileUrl && !uploadMutation.isPending && (
            <Icon
              icon='mdi:check-circle-outline'
              className='size-5 text-emerald-500'
            />
          )}
        </div>
      </div>

      {progress && (
        <div className='space-y-1'>
          <div className='text-muted-foreground flex justify-between text-xs'>
            <span>Yükleniyor...</span>
            <span>{loadedPercent}%</span>
          </div>
          <Progress
            value={loadedPercent}
            className='h-1'
          />
        </div>
      )}
    </div>
  );
}

export function FieldFileInput({ name, ...props }: FileInputProps) {
  const { control } = useFormContext();

  if (!name) {
    throw new Error("FieldFileInput requires a name prop");
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FileInput
          id={name}
          {...props}
          {...field}
          onUploadSuccess={(url) => field.onChange(url)}
          data-invalid={Boolean(invalid)}
          data-error={Boolean(error)}
        />
      )}
    />
  );
}
