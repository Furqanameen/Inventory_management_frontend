import { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
// import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Group, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useProduct } from '../../context/Product/provider';
import classes from './table.module.css';

const ProductsTable = () => {
  // const [selection, setSelection] = useState([]);
  const [delItem, setDelItem] = useState(null);
  const navigate = useNavigate();

  const { data, deleteRecord, loading, sortBy, setSorting, reverseSortDirection } = useProduct();

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
        // notifications.show({ message: 'Product inactive successfully' });
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
          <Table.Td width={'15%'}>
            <Group gap="sm">
              {/* <Avatar size={30} src={item.avatar} radius="lg" /> */}
              <Text size="md" fw={500}>
                {item?.name ?? 'N/A'}
              </Text>
            </Group>
          </Table.Td>

          <Table.Td width={'15%'}>
            <Text size="sm" ta="start">
              {item?.sku ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'10%'}>
            <Text size="sm" ta="start">
              {item?.barcode ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'10%'}>
            <Text size="sm" ta="center">
              {item?.purchasePrice ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'8%'}>
            <Text size="sm" ta="center">
              {item?.salePrice ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'10%'}>
            <Text size="sm" ta="center">
              {item?.quantity ?? 'N/A'}
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
          <Table.Td width="22%">
            <Group gap="sm" ta="end" justify="end">
              <Button
                size="sm"
                variant="filled"
                px="xs"
                color="dark"
                onClick={() => navigate(`/product/${item._id}/stock`)}
                disabled={loading}
              >
                Stock
              </Button>
              <Button
                size="sm"
                px="xs"
                variant="filled"
                onClick={() => navigate(`/product/${item._id}`)}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                size="sm"
                px="xs"
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
        miw={1200}
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
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'sku'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('sku')}
            >
              SKU
            </Th>
            <Th
              sorted={sortBy === 'barcode'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('barcode')}
            >
              Barcode
            </Th>
            <Th
              sorted={sortBy === 'purchasePrice'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('purchasePrice')}
            >
              Purchase
            </Th>
            <Th
              sorted={sortBy === 'salePrice'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('salePrice')}
            >
              Sale
            </Th>

            <Th
              sorted={sortBy === 'quantity'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('quantity')}
              ta="center"
            >
              Quantity
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

export default ProductsTable;
