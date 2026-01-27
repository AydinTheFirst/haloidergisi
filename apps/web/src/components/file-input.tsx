import { cn, Progress, Spinner, useField } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query"; // Mutlaka kullanmalısın
import { AxiosProgressEvent } from "axios";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUploadSuccess?: (url: string) => void;
}

export default function FileInput({ className, onUploadSuccess, ...props }: FileInputProps) {
  const [fileUrl, setFileUrl] = React.useState<string>("");
  const [progress, setProgress] = React.useState<AxiosProgressEvent | null>(null);

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
    <div className='relative w-full'>
      <input
        type='hidden'
        value={fileUrl}
        name={props.name}
      />

      <div className='relative'>
        <input
          type='file'
          disabled={uploadMutation.isPending}
          className={cn("input pr-10", className)}
          onChange={handleFileChange}
          {...props}
        />
        <div className='absolute top-1/2 right-3 -translate-y-1/2'>
          {uploadMutation.isPending && <Spinner className='size-5' />}
          {fileUrl && (
            <Icon
              icon='mdi:check-circle-outline'
              className='text-success size-5'
            />
          )}
        </div>
      </div>

      {progress && (
        <Progress.Root
          className='max-w-none'
          value={loadedPercent}
          max={100}
        >
          <Progress.Label>Yükleniyor...</Progress.Label>
          <Progress.Value />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      )}
    </div>
  );
}

export function FieldFileInput(props: FileInputProps) {
  const { control } = useFormContext();
  const { name, isRequired } = useField();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FileInput
          id={name}
          name={field.name}
          {...props}
          onUploadSuccess={(url) => field.onChange(url)}
          required={isRequired}
          data-invalid={Boolean(invalid)}
          data-error={Boolean(error)}
        />
      )}
    />
  );
}
