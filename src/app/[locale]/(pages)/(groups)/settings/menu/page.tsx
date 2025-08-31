'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
// import MenuInputForm from './menu-input-form';
import Heading from '@/components/heading';


const MenuPage = () => {
  const handAdd = () => {
    // useStoreModal.getState().openModal({
    //   title: "Add Menu",
    //   content: <MenuInputForm data={null} />
    // });
  };

  const [search, setSearch] = useState("");
  const [data,setData] = useState([]);
  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={'Menu'} description='Menu management'/>
        <Button className='ml-auto min-w-[100px]' onClick={handAdd}>Add</Button>
      </div>
      <div className="mb-10 flex">
        <Input className='w-2xs ml-auto' placeholder='Search with title' onChange={(v) => setSearch(v.target.value)} />
      </div>
     
      {/* <GlobalDataTable
        columns={menuItemColumn}
        apiUrl={'/api/v1/menu'}
        // initialPageSize={2}
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
      /> */}
    </div>
  );
};

export default MenuPage;