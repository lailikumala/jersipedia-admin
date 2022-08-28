import { tambahLiga } from "../../config/actions/LigaAction";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import DefaultImage from "../../assets/img/default-image.jpg";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const TambahLiga = () => {
  const [namaLiga, setNamaLiga]   = useState("")
  const [imageToDB, setImageToDB] = useState(false)
  const [image, setImage]         = useState(DefaultImage)
  const {tambahLigaLoading}       = useSelector((s) => s.LigaReducer)
  const history                   = useHistory()
  const dispatch                  = useDispatch()

  const handleChange = (event) => {
    setNamaLiga( event.target.value);
  };

  const handleImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const gambar = event.target.files[0];
      setImage(URL.createObjectURL(gambar))
      setImageToDB(gambar)
      
    }
  };

  const handleSubmit = (event) => {
    const data ={ namaLiga: namaLiga, imageToDB: imageToDB}
    event.preventDefault();
    if (imageToDB && namaLiga) {
      //proses lanjut ke action firebase
    dispatch(tambahLiga(data, history));
    } else {
      //alert
      Swal.fire({
        title: "Gagal",
        text: "Maaf Nama Liga dan Logo Liga harus diisi",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  };
  
    return (
      <div className="content">
        <Row>
          <Col>
            <Link to="/admin/liga" className="btn btn-primary">
              Kembali
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Tambah Liga</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <img src={image} width="200" alt="Logo Liga" />
                  </Col>
                </Row>
                <form onSubmit={(event) => handleSubmit(event)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <label>Logo Liga</label>
                        <Input
                          type="file"
                          onChange={(event) => handleImage(event)}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <label>Nama Liga</label>
                        <Input
                          type="text"
                          value={namaLiga}
                          name="namaLiga"
                          onChange={(event) => handleChange(event)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      {tambahLigaLoading ? (
                        <Button color="primary" type="submit" disabled>
                          <Spinner size="sm" color="light" /> Loading
                        </Button>
                      ) : (
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      )}
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

export default TambahLiga;
