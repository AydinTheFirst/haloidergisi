import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { LucideFile, LucideTrash, LucideView } from "lucide-react";

import { getFileUrl } from "@/utils";

interface FilesTableProps {
  files: string[];
  onFileClick?: (file: string) => void;
  onFileDelete?: (file: string) => void;
  onFileDownload?: (file: string) => void;
}

export default function FilesTable(props: FilesTableProps) {
  const { files, onFileClick, onFileDelete, onFileDownload } = props;

  // Function to preview the file based on its extension
  const previewFile = (file: string) => {
    const fileExt = file.split(".").pop() || "";
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const isImage = imageExtensions.includes(fileExt.toLowerCase());

    if (isImage) {
      return (
        <Image
          alt={file}
          className='h-10 w-10'
          onClick={() => onFileClick && onFileClick(file)}
          src={getFileUrl(file)}
        />
      );
    }

    return <LucideFile className='h-10 w-10' />;
  };

  return (
    <Table>
      <TableHeader>
        <TableColumn>Önizleme</TableColumn>
        <TableColumn>Dosya Adı</TableColumn>
        <TableColumn>İşlemler</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          <div className='flex h-40 w-full items-center justify-center text-gray-500'>
            Dosya bulunamadı.
          </div>
        }
      >
        {files.map((file) => (
          <TableRow key={file}>
            <TableCell>{previewFile(file)}</TableCell>
            <TableCell>{file}</TableCell>
            <TableCell className='flex gap-3'>
              {onFileClick && (
                <button
                  onClick={() => onFileClick(file)}
                  type='button'
                >
                  <LucideView />
                </button>
              )}
              {onFileDownload && (
                <button
                  onClick={() => onFileDownload(file)}
                  type='button'
                >
                  <LucideView />
                </button>
              )}
              {onFileDelete && (
                <button
                  onClick={() => onFileDelete(file)}
                  type='button'
                >
                  <LucideTrash />
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
