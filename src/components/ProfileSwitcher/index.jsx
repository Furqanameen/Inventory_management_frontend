import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '@mantine/core';
import { AuthContext } from '../../context/Auth/AuthContext';

const ProfileSwitcher = () => {
  const { selectedProfile, switchProfile, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const profiles = user?.profiles || [];

  if (!profiles?.length) return null;

  return (
    <Select
      // label="Switch Profile"
      // w={275}

      placeholder="Select a profile"
      data={profiles.map((p) => ({
        value: p._id,
        label: `${p.store.displayName} ${p.role !== 'None' ? `- ${p.role}` : ''}`,
      }))}
      value={selectedProfile?._id}
      onChange={(value) => {
        if (value) {
          switchProfile(value);
          navigate('/');
        }
      }}
      onClick={(e) => e.stopPropagation()}
      // withinPortal
      size="md"
      radius="none"
      pb="xs"
      styles={{
        dropdown: { minWidth: 200 },
        input: {
          border: 'none',
          borderBottom: '1px solid #E0E0E0',
        },
      }}
    />
  );
};

export default ProfileSwitcher;
