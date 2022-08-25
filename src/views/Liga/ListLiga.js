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
  Button,
  Spinner,
} from "reactstrap";
import { deleteLiga, getListLiga } from "../../config/actions/LigaAction"; 
import { Link } from "react-router-dom";

  const ListLiga = () => {
    const dispatch = useDispatch() 
    const { getListLigaError, getListLigaLoading, getListLigaResult, deleteLigaResult} = useSelector((s) => s.LigaReducer)

    useEffect(() => {
      dispatch(getListLiga());
    },[])

    const removeData = (image, id) => {
      //akses ke action
      dispatch(deleteLiga(image, id)) 
    };
    
    useEffect(() => {
      if(deleteLigaResult) dispatch(getListLiga());
    },[deleteLigaResult])

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Master Liga</CardTitle>
                <Link
                  to="/admin/liga/tambah"
                  className="btn btn-primary float-right"
                >
                  Tambah Liga
                </Link>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th>Logo</th>
                      <th>Nama Liga</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {getListLigaResult ? (
                      Object.keys(getListLigaResult).map((key) => (
                        <tr key={key}>
                          <td>
                            <img
                              src={getListLigaResult[key].image}
                              width="100"
                              alt={getListLigaResult[key].namaLiga}
                            />
                          </td>
                          <td>{getListLigaResult[key].namaLiga}</td>
                          <td>
                            <Link
                              className="btn btn-warning"
                              to={"/admin/liga/edit/" + key}
                            >
                              <i className="nc-icon nc-ruler-pencil"></i> Edit
                            </Link>

                            <Button
                              color="danger"
                              className="ml-2"
                              onClick={() =>
                                removeData(
                                  getListLigaResult[key].image,
                                  key
                                )
                              }
                            >
                              <i className="nc-icon nc-basket"></i> Hapus
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : getListLigaLoading ? (
                      <tr>
                        <td colSpan="3" align="center">
                          <Spinner color="primary" />
                        </td>
                      </tr>
                    ) : getListLigaError ? (
                      <tr>
                        <td colSpan="3" align="center">
                          {getListLigaError}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="3" align="center">
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


export default ListLiga;
