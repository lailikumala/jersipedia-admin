import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Spinner,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import { deleteJersey, getListJersey } from '../../config/actions/JerseyAction'

const ListJersey = () => {
  
  const dispatch    = useDispatch();
  const {deleteJerseyResult, getListJerseyError, getListJerseyLoading, getListJerseyResult} = useSelector((s) => s.JerseyReducer);

  useEffect(()=> {
    dispatch(getListJersey());
  },[])

  useEffect(() => {
    if(deleteJerseyResult) dispatch(getListJersey());
  },[deleteJerseyResult])


  const removeData = (images, key) => {
    dispatch(deleteJersey(images, key)); 
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Master Jersey</CardTitle>
              <Link
                to="/admin/jersey/tambah"
                className="btn btn-primary float-right"
              >
                Tambah Jersey
              </Link>
            </CardHeader>
            <CardBody>
              <Table>
                <thead className="text-primary">
                  <tr>
                    <th>Foto</th>
                    <th>Nama Jersey</th>
                    <th>Harga</th>
                    <th>Berat</th>
                    <th>Jenis</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                {getListJerseyResult ? (
                    Object.keys(getListJerseyResult).map((key) => (
                      <tr key={key}>
                        <td>
                          <img
                            src={getListJerseyResult[key].gambar[0]}
                            width="100"
                            alt={getListJerseyResult[key].nama}
                          />
                        </td>
                        <td>{getListJerseyResult[key].nama}</td>
                        <td>Rp. {getListJerseyResult[key].harga}</td>
                        <td>{getListJerseyResult[key].berat} kg</td>
                        <td>{getListJerseyResult[key].jenis} </td>
                        <td>
                          <Link
                            className="btn btn-warning"
                            to={"/admin/jersey/edit/" + key}
                          >
                            <i className="nc-icon nc-ruler-pencil"></i> Edit
                          </Link>

                          <Button
                            color="danger"
                            className="ml-2"
                            onClick={() => removeData(getListJerseyResult[key].gambar, key)}
                          >
                            <i className="nc-icon nc-basket"></i> Hapus
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : getListJerseyLoading ? (
                    <tr>
                      <td colSpan="6" align="center">
                        <Spinner color="primary" />
                      </td>
                    </tr>
                  ) : getListJerseyError ? (
                    <tr>
                      <td colSpan="6" align="center">
                        {getListJerseyError}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="6" align="center">
                        Data Kosong
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ListJersey;
