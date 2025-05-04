// import { useState } from 'react';
import { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
// import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Group, Table, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useUser } from '../../context/User/provider';
import classes from './table.module.css';

const PermissionsTable = () => {
  // const [selection, setSelection] = useState([]);
  const [delItem, setDelItem] = useState(null);
  const navigate = useNavigate();

  const { data, deleteRecord, loading, sortBy, setSorting, reverseSortDirection } = useUser();

  // const toggleRow = (_id) =>
  //   setSelection((current) =>
  //     current.includes(_id) ? current.filter((item) => item !== _id) : [...current, _id]
  //   );

  const openDeleteModal = (item) => {
    setDelItem(item);
    return modals.openConfirmModal({
      title: `Inactive ${item?.name || item?.email}`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to inactive <strong>{item?.name || item?.email}</strong>?
          {/* <br /> This action is irreversible and all data will be lost. */}
        </Text>
      ),
      labels: { confirm: 'Inactive', cancel: "No don't inactive it" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        await deleteRecord(item._id);
        setDelItem(null);
      },
    });
  };

  // eslint-disable-next-line react/prop-types
  function Th({ children, reversed, sorted, onSort, ...props }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
      <Table.Th className={classes.th} {...props}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group justify="space-between">
            <Text fw={500} fz="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={16} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      </Table.Th>
    );
  }

  const Rows = () => {
    return data.map((item) => {
      // const selected = selection.includes(item._id);
      return (
        <Table.Tr
          key={item._id}
          // className={cx({ [classes?.rowSelected]: selected })}
        >
          {/* <Table.Td>
            <Checkbox checked={selection.includes(item._id)} onChange={() => toggleRow(item._id)} />
          </Table.Td> */}
          <Table.Td width="10%">
            <Text size="sm" ta="start">
              {item?.name ?? 'N/A'}
            </Text>
          </Table.Td>
          <Table.Td width="10%">
            <Text size="md" fw={500}>
              {item?.email ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width="11%">
            <Text size="sm" ta="start">
              {item?.role ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width="10%">
            <Text size="sm" ta="start">
              {item.deleted ? (
                <Text c="red" size="sm">
                  Inactive
                </Text>
              ) : (
                <Text c="green" size="sm">
                  Active
                </Text>
              )}
            </Text>
          </Table.Td>

          <Table.Td width="10%">
            <Group gap="sm" ta="end" justify="center">
              <Button
                size="sm"
                variant="filled"
                onClick={() => navigate(`/user/${item._id}`)}
                disabled={loading}
                w="70px"
                px="xs"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="filled"
                color="red"
                onClick={() => openDeleteModal(item)}
                loading={delItem?._id === item._id && loading}
                disabled={loading || item.deleted}
              >
                Inactive
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>
      );
    });
  };

  return (
    <Table.ScrollContainer type="native">
      <Table
        miw={800}
        verticalSpacing="xs"
        style={{ fontFamily: 'Lexend, sans-serif', marginTop: '20px' }}
      >
        <Table.Thead>
          <Table.Tr>
            {/* <Table.Th w={40}>
              <Checkbox onChange={() => {}} />
            </Table.Th> */}
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'email'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === 'role'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('role')}
            >
              Role
            </Th>
            <Th
              sorted={sortBy === 'deleted'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('deleted')}
            >
              Status
            </Th>

            <Table.Th ta="center">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{<Rows />}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default PermissionsTable;
