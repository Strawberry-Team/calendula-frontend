import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {UiMessages} from "@/constants/uiMessages.ts";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    calendarTitle: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, calendarTitle }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="w-100 text-center">
                <DialogHeader>
                    <DialogTitle className="text-[15px]">{UiMessages.DELETE_MODAL.TITLE} "{calendarTitle}"?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex justify-center">
                    <Button variant="outline" onClick={onClose}>{UiMessages.GENERAL.CANCEL_BUTTON}</Button>
                    <Button variant="destructive" onClick={onConfirm}>{UiMessages.GENERAL.DELETE_BUTTON}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
