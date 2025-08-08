'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useStoreModal from '@/stores/store-model';
import { useState } from 'react';
import { menuItemColumn } from './column-def';
import MenuInputForm from './menu-input-form';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';


const MenuPage = () => {
  const handAdd = () => {
    useStoreModal.getState().openModal({
      title: "Add Menu",
      content: <MenuInputForm data={null} />
    });
  };

  const [search, setSearch] = useState("");
  const [data,setData] = useState([]);
  return (
    <div>
      <div className='mb-5 flex'>
        <h1 className='text-xl font-bold'>Menu</h1>
        <Button className='ml-auto min-w-[100px]' onClick={handAdd}>Add</Button>
      </div>
      <div className="mb-10 flex">
        <Input className='w-2xs ml-auto' placeholder='Search with title' onChange={(v) => setSearch(v.target.value)} />
      </div>
     
      <GlobalDataTable
        columns={menuItemColumn}
        apiUrl={'/api/menu'}
        initialPageSize={2}
        searchCriteria={[
          {
            column: "parent",
            value: "isNull",
            searchable: false,
            orderable: false
          },
          {
            column: "title",
            value: search,
            searchable: true,
            orderable: false
          }
        ]}
      />
    </div>
  );
};

export default MenuPage;