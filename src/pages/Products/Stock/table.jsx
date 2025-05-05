/* eslint-disable react/prop-types */
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
// import cx from 'clsx';
import { Center, Group, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import classes from '../table.module.css';

const ProductsTable = ({ data, sortBy, setSorting, reverseSortDirection }) => {
  // const [delItem, setDelItem] = useState(null);
  // const navigate = useNavigate();

  // const toggleRow = (_id) =>
  //   setSelection((current) =>
  //     current.includes(_id) ? current.filter((item) => item !== _id) : [...current, _id]
  //   );

  // const openDeleteModal = (item) => {
  //   setDelItem(item);
  //   return modals.openConfirmModal({
  //     title: `Inactive ${item.name}`,
  //     centered: true,
  //     children: (
  //       <Text size="sm">
  //         Are you sure you want to inactive <strong>{item.name}</strong>?
  //         {/* <br /> This action is irreversible and all data will be lost. */}
  //       </Text>
  //     ),
  //     labels: { confirm: 'Inactive', cancel: "No don't inactive it" },
  //     confirmProps: { color: 'red' },
  //     onCancel: () => console.log('Cancel'),
  //     onConfirm: async () => {
  //       await deleteRecord(item._id);
  //       setDelItem(null);
  //       // notifications.show({ message: 'Product inactive successfully' });
  //     },
  //   });
  // };

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
          <Table.Td width={'25%'}>
            <Text size="sm" ta="start">
              {item?.quantity ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'25%'}>
            <Text size="sm" ta="start">
              {item?.stockType ?? 'N/A'}
            </Text>
          </Table.Td>

          <Table.Td width={'40%'}>
            <Text size="sm" ta="start">
              {item?.comment ?? 'N/A'}
            </Text>
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
              sorted={sortBy === 'quantity'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('quantity')}
              ta="center"
            >
              Quantity
            </Th>
            <Th
              sorted={sortBy === 'stockType'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('stockType')}
            >
              Type
            </Th>
            <Th
              sorted={sortBy === 'comment'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('comment')}
            >
              Comment
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{<Rows />}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default ProductsTable;
