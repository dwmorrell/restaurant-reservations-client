import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { clearTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the CreateTable component
 */
function Table() {

    const history = useHistory();

    // useState functions
    const [table, setTable] = useState([]);
    const [tableError, setTableError] = useState(null);

    /**
    * useEffect function to list current tables
    * Calls the listTables API
    */
    useEffect(function () {

        const abortController = new AbortController();
        setTableError(null);
        listTables(abortController.signal)
            .then(setTable)
            .catch(setTableError);
        return () => abortController.abort();

    }, []);

    /**
    * Clear table handler with confirmation window warning
    * Calls the clearTable API
    * @param {table_id}
    */
    const handleClearTable = async function (table_id) {
        try {
            const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
            if (result) {
                await clearTable(table_id);
                history.go();
            }
        } catch(error) {
            setTableError(error);
        }
    }

    return (
        <div>
            <ErrorAlert error={tableError} />
            <div className="table-responsive-lg">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Table #</th>
                            <th>Table Name</th>
                            <th>Seating Capacity</th>
                            <th>Availability</th>
                            <th>Clear Table</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {table.map((tbl) => 
                            <tr key={tbl.table_id}>
                                <td> {tbl.table_id} </td>
                                <td> {tbl.table_name} </td>
                                <td> {tbl.capacity} </td>
                                <td data-table-id-status={tbl.table_id}> 
                                    {/* If the reservation_id column is null, display "Free", otherwise display "Occupied" */}
                                    {tbl.reservation_id ? "Occupied" : "Free"}
                                </td>
                                <td>
                                    {/* If the reservation_id column is NOT null, display a Finish button*/}
                                    {tbl.reservation_id ?                             
                                        <button 
                                            data-table-id-finish={tbl.table_id}
                                            className="btn btn-primary ml-2"
                                            onClick={() => handleClearTable(tbl.table_id, tbl.reservation_id)}
                                        >
                                            Finish
                                        </button>
                                    : ""}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default Table;