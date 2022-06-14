import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
    {
        type: "all",
        label: "All",
    },
    {
        type: "active",
        label: "Active",
    },
    {
        type: "done",
        label: "Done",
    },
];

const toDoItems = [
    {
        key: uuidv4(),
        label: "Have fun",
    },
    {
        key: uuidv4(),
        label: "Spread Empathy",
    },
    {
        key: uuidv4(),
        label: "Generate Value",
    },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
    if (!localStorage.getItem("items")) {
        localStorage.setItem("items", JSON.stringify(toDoItems));
    }

    const [itemToAdd, setItemToAdd] = useState("");
    //arrow declaration => expensive computation ex: API calls
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem("items"))
    );

    const [filterType, setFilterType] = useState("");

    const [filterItems, setFilterItems] = useState([]);

    const [emptySearch, setEmptySearch] = useState(true);

    const handleChangeItem = (event) => {
        setItemToAdd(event.target.value);
    };

    useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items));
    }, [items]);

    const handleAddItem = () => {
        // mutating !WRONG!
        // const oldItems = items;
        // oldItems.push({ label: itemToAdd, key: uuidv4() });
        // setItems(oldItems);

        // not mutating !CORRECT!
        setItems((prevItems) => [
            { label: itemToAdd, key: uuidv4() },
            ...prevItems,
        ]);

        setItemToAdd("");
    };

    const handleItemDone = ({ key }) => {
        //first way
        // const itemIndex = items.findIndex((item) => item.key === key);
        // const oldItem = items[itemIndex];
        // const newItem = { ...oldItem, done: !oldItem.done };
        // const leftSideOfAnArray = items.slice(0, itemIndex);
        // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
        // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

        //  second way
        // const changedItem = items.map((item) => {
        //   if (item.key === key) {
        //     return { ...item, done: item.done ? false : true };
        //   } else return item;
        // });

        //second way updated
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return { ...item, done: !item.done };
                }
                return item;
            })
        );

        if (filterItems.length !== 0) {
            setFilterItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.key === key) {
                        return { ...item, done: !item.done };
                    }
                    return item;
                })
            );
        }
    };

    const handleFilterItems = (type) => {
        setFilterType(type);
    };

    const handleImportantItem = ({ key }) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return { ...item, important: !item.important };
                }
                return item;
            })
        );

        if (filterItems.length !== 0) {
            setFilterItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.key === key) {
                        return { ...item, important: !item.important };
                    }
                    return item;
                })
            );
        }
    };

    const handleSearch = (e) => {
        setFilterItems(
            items.filter((item) =>
                item.label
                    .toLocaleLowerCase()
                    .includes(e.target.value.toLocaleLowerCase())
            )
        );
        if (e.target.value.length === 0) {
            setEmptySearch(true);
        } else {
            setEmptySearch(false);
        }
    };

    const handleDeleteItem = ({ key }) => {
        const itemIndex = items.findIndex((item) => item.key === key);
        const leftSideOfAnArray = items.slice(0, itemIndex);
        const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
        setItems([...leftSideOfAnArray, ...rightSideOfAnArray]);

        if (filterItems.length !== 0) {
            const itemIndex = filterItems.findIndex((item) => item.key === key);
            const leftSideOfAnArray = filterItems.slice(0, itemIndex);
            const rightSideOfAnArray = filterItems.slice(
                itemIndex + 1,
                filterItems.length
            );

            console.log(leftSideOfAnArray, rightSideOfAnArray);
            setFilterItems([...leftSideOfAnArray, ...rightSideOfAnArray]);
        }
    };

    const amountDone = items.filter((item) => item.done).length;

    const amountLeft = items.length - amountDone;

    let filteredItems;

    if (filterItems.length !== 0) {
        console.log(filterItems);
        filteredItems =
            !filterType || filterType === "all"
                ? filterItems
                : filterType === "active"
                ? filterItems.filter((item) => !item.done)
                : filterItems.filter((item) => item.done);
    } else {
        if (emptySearch) {
            filteredItems =
                !filterType || filterType === "all"
                    ? items
                    : filterType === "active"
                    ? items.filter((item) => !item.done)
                    : items.filter((item) => item.done);
        }
    }

    return (
        <div className="todo-app">
            {/* App-header */}
            <div className="app-header d-flex">
                <h1>Todo List</h1>
                <h2>
                    {amountLeft} more to do, {amountDone} done
                </h2>
            </div>

            <div className="top-panel d-flex">
                {/* Search-panel */}
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="type to search"
                    onChange={handleSearch}
                />
                {/* Item-status-filter */}
                <div className="btn-group">
                    {buttons.map((item) => (
                        <button
                            onClick={() => handleFilterItems(item.type)}
                            key={item.type}
                            type="button"
                            className={`btn btn-${
                                filterType !== item.type ? "outline-" : ""
                            }info`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List-group */}
            <ul className="list-group todo-list">
                {filteredItems &&
                    filteredItems.map((item) => (
                        <li key={item.key} className="list-group-item">
                            <span
                                className={`todo-list-item${
                                    item.done ? " done" : ""
                                } ${item.important ? "important" : ""}`}
                            >
                                <span
                                    className="todo-list-item-label"
                                    onClick={() => handleItemDone(item)}
                                >
                                    {item.label}
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-outline-success btn-sm float-right"
                                    onClick={() => handleImportantItem(item)}
                                >
                                    <i className="fa fa-exclamation" />
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm float-right"
                                    onClick={() => handleDeleteItem(item)}
                                >
                                    <i className="fa fa-trash-o" />
                                </button>
                            </span>
                        </li>
                    ))}
            </ul>

            {/* Add form */}
            <div className="item-add-form d-flex">
                <input
                    value={itemToAdd}
                    type="text"
                    className="form-control"
                    placeholder="What needs to be done"
                    onChange={handleChangeItem}
                />
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleAddItem}
                >
                    Add item
                </button>
            </div>
        </div>
    );
}

export default App;
