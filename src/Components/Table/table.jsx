import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import Menu from "antd/lib/menu";
import { Dropdown } from "antd/lib";
import {
  FILTER_BY_NAME,
  FILTER_BY_EMAIL,
  CLEAR_FILTERS,
} from "../../utils/constants";
import { useRef } from "react";
import { clear } from "@testing-library/user-event/dist/clear";

const { Column, ColumnGroup } = Table;

export const TableComponent = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_BY_NAME);
  const pageSize = 5;
  const filterRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?_page=${pageNumber}&_limit=${pageSize}`
      );

      const totalCount = response.headers.get("x-total-count"); // total count of elements
      const data = await response.json();

      setTotalPages(parseInt(totalCount ?? "1"));
      setDataSource(data);
      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingData(false);
    }
  };

  const filterSelection = async (event) => {
    if (event.key === CLEAR_FILTERS) return await fetchData();
    setSelectedFilter(event.key);
    clearInput();
  };

  const clearInput = async () => {
    if (filterRef.current) {
      filterRef.current.value = "";
    }
    await fetchData();
  };

  const handleFilter = (event) => {
    const value = event.target.value;
    console.log(selectedFilter);
    if (selectedFilter === FILTER_BY_NAME) {
      const filteredData = dataSource.filter((it) =>
        it.name.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    } else if (selectedFilter === FILTER_BY_EMAIL) {
      const filteredData = dataSource.filter((it) =>
        it.email.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    }
  };

  const menu = (
    <Menu onClick={filterSelection}>
      <Menu.Item key={FILTER_BY_NAME}>{FILTER_BY_NAME}</Menu.Item>
      <Menu.Item key={FILTER_BY_EMAIL}>{FILTER_BY_EMAIL}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={CLEAR_FILTERS}>{CLEAR_FILTERS}</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    fetchData();
  }, [pageNumber]);
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <Dropdown className="filter" overlay={menu}>
          <a className="ant-dropdown-link" href="#" style={{ padding: "10px" }}>
            {selectedFilter}
          </a>
        </Dropdown>
        <input
          type="text"
          onChange={handleFilter}
          ref={filterRef}
          style={{ padding: "10px", marginLeft: "10px" }}
        />
        <button onClick={clearInput}>X</button>
      </div>

      <Table
        dataSource={dataSource}
        loading={loadingData}
        pagination={{
          total: totalPages,
          pageSize: pageSize,
          onChange: (page) => {
            setPageNumber(page);
          },
        }}
      >
        <Column title="ID" dataIndex="id" key="id" />
        <Column
          title="Name"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name.localeCompare(b.name)}
          sortDirections={["ascend", "descend"]}
        />
        <ColumnGroup title="Address">
          <Column
            title="Suite"
            dataIndex="suite"
            key="suite"
            render={(_, record) => record?.address?.suite ?? "N/A"}
          />
          <Column
            title="Street"
            dataIndex="street"
            key="street"
            render={(_, record) => record?.address?.street ?? "N/A"}
          />
          <Column
            title="City"
            dataIndex="city"
            key="city"
            render={(_, record) => record?.address?.city ?? "N/A"}
          />
          <Column
            title="Zip Code"
            dataIndex="zipcode"
            key="zipcode"
            render={(_, record) => record?.address?.zipcode ?? "N/A"}
          />
        </ColumnGroup>
        <Column title="Username" dataIndex="username" key="username" />
        <Column
          title="Email"
          dataIndex="email"
          key="email"
          sorter={(a, b) => a.name.localeCompare(b.name)}
          sortDirections={["ascend", "descend"]}
        />
        <Column title="Phone" dataIndex="phone" key="phone" />
        <Column title="Website" dataIndex="website" key="website" />
        <ColumnGroup title="Company">
          <Column
            title="Name"
            dataIndex="name"
            key="name"
            render={(_, record) => record?.company?.name ?? "N/A"}
          />
          <Column
            title="BS"
            dataIndex="bs"
            key="bs"
            render={(_, record) => record?.company?.bs ?? "N/A"}
          />
          <Column
            title="Catch Phrase"
            dataIndex="catchPhrase"
            key="catchPhrase"
            render={(_, record) => record?.company?.catchPhrase ?? "N/A"}
          />
        </ColumnGroup>
      </Table>
    </>
  );
};
