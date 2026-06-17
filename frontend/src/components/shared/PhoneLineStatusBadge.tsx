import React from 'react';
import {
  phoneLineStatusClass,
  phoneLineStatusLabel,
  resolvePhoneLineStatus,
} from '@/lib/phoneNumberStatus';

type Props = {
  row: {
    status?: string | null;
    port_requested?: boolean | null;
    port_status?: string | null;
  };
};

const PhoneLineStatusBadge: React.FC<Props> = ({ row }) => {
  const lineStatus = resolvePhoneLineStatus(row);
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${phoneLineStatusClass(lineStatus)}`}
    >
      {phoneLineStatusLabel(lineStatus)}
    </span>
  );
};

export default PhoneLineStatusBadge;
