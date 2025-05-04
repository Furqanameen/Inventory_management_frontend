import { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
// import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Group, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useStore } from '../../context/Store/provider';
import classes from './table.module.css';

const StoresTable = () => {
  // const [selection, setSelection] = useState([]);
  const [delItem, setDelItem] = useState(null);
  const navigate = useNavigate();

  const { data, deleteRecord, loading, sortBy, setSorting, reverseSortDirection } = useStore();

  // const toggleRow = (_id) =>
  //   setSelection((current) =>
  //     current.includes(_id) ? current.filter((item) => item !== _id) : [...current, _id]
  //   );

  const openDeleteModal = (item) => {
    setDelItem(item);
    return modals.openConfirmModal({
      title: `Inactive ${item.name}`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to inactive <strong>{item.name}</strong>?
          {/* <br /> This action is irreversible and all data will be lost. */}
        </Text>
      ),
      labels: { confirm: 'Inactive', cancel: "No don't inactive it" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        await deleteRecord(item._id);
        setDelItem(null);
        // notifications.show({ message: 'Store inactive successfully' });
      },
    });
  };

  // eslint-disable-next-line react/prop-types
  function Th({ children, reversed, sorted, onSort, ...props }) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
      <Table.Th className={classes.th} {...props}>
        <UnstyledButton onClick={onSort} className={classes.control} ta="start">
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
          <Table.Td width={'70%'}>
            <Group gap="sm">
              {/* <Avatar size={30} src={item.avatar} radius="lg" /> */}
              <Text size="md" fw={500}>
                {item?.displayName ?? 'N/A'}
              </Text>
            </Group>
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
          <Table.Td width="20%">
            <Group gap="sm" ta="end" justify="end">
              <Button
                size="sm"
                variant="filled"
                onClick={() => navigate(`/store/${item._id}`)}
                disabled={loading}
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
    <ScrollArea>
      <Table
        miw={800}
        verticalSpacing="md"
        style={{ fontFamily: 'Lexend, sans-serif', marginTop: '20px' }}
      >
        <Table.Thead>
          <Table.Tr>
            {/* <Table.Th w={40}>
              <Checkbox onChange={() => {}} />
            </Table.Th> */}
            {/* <Table.Th>Name</Table.Th> */}
            <Th
              sorted={sortBy === 'displayName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('displayName')}
            >
              Name
            </Th>

            <Th
              sorted={sortBy === 'deleted'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('deleted')}
              ta="center"
            >
              Status
            </Th>
            <Table.Th ta="center">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{<Rows />}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default StoresTable;
