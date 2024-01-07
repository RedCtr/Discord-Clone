"use client";
import React, { useEffect, useState } from "react";
import { CreateServerModal } from "../modals/createServerModal";
import { InviteModal } from "../modals/InviteModal";
import { EditServerModal } from "../modals/EditServerModal";
import { ManageMembersModal } from "../modals/ManageMembersModal";
import { CreateChannelModal } from "../modals/CreateChannelModal";
import { LeaveServerModal } from "../modals/LeaveServerModal";
import { DeleteServerModal } from "../modals/DeleteServerModal";
import { EditChannelModal } from "../modals/EditChannelModal";
import { DeleteChannelModal } from "../modals/DeleteChannelModal";
import { MessageFileModal } from "../modals/MessageFileModal";
import { DeleteMessagelModal } from "../modals/DeleteMessagelModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <EditChannelModal />
      <DeleteChannelModal />

      <MessageFileModal />
      <DeleteMessagelModal />
    </>
  );
};

export default ModalProvider;
