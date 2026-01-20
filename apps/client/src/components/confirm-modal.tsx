import type React from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type UseDisclosureProps,
} from "@heroui/react";

interface ConfirmModalProps extends UseDisclosureProps {
  message: React.ReactNode;
  onConfirm: () => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const { isOpen, message, onClose, onConfirm } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Emin misiniz?</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose} variant="light">
            Vazgeç
          </Button>
          <Button
            color="primary"
            onPress={() => {
              onConfirm();
              if (onClose) onClose();
            }}
          >
            Onayla
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
