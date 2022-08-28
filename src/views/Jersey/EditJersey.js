import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import DefaultImage from "../../assets/img/default-image.jpg";
import {
  getDetailJersey,
  updateJersey,
  uploadJersey,
} from "../../config/actions/JerseyAction";
import swal from "sweetalert";
import { getListLiga } from "../../config/actions/LigaAction";
import { useHistory } from "react-router-dom";

const EditJersey = (props) => {
    const id = props.match.params.id
    const [image1, setImage1]         = useState(DefaultImage);
    const [image2, setImage2]         = useState(DefaultImage);
    const [imageToDB1, setImageToDB1] = useState(false);
    const [imageToDB2, setImageToDB2] = useState(false);
    const [imageLama1, setImageLama1] = useState(false);
    const [imageLama2, setImageLama2] = useState(false);
    const [nama, setNama]             = useState("")
    const [harga, setHarga]           = useState(0);
    const [berat, setBerat]           = useState(0);
    const [jenis, setJenis]           = useState("");
    const [ukurans, setUkurans]       = useState(["S", "M", "L", "XL", "XXL"]);
    const [ukuranSelected, setUkuranSelected] =useState([]);
    const [ready, setReady]           = useState(true);
    const [editUkuran, setEditUkuran] = useState(false);
    const [liga, setLiga]             = useState("");
    const history                     = useHistory();
    const dispatch                    = useDispatch();

    const { getListLigaResult } = useSelector((s) => s.LigaReducer);
    const { uploadJerseyResult, getDetailJerseyResult, updateJerseyLoading, updateJerseyResult } = useSelector((s) => s.JerseyReducer);
    
    useEffect(() => {
      dispatch(getListLiga());
      dispatch(getDetailJersey(id));
    },[id])

    useEffect(() => {
      if(getDetailJerseyResult) {
        setImage1(getDetailJerseyResult.gambar[0]);
        setImage2(getDetailJerseyResult.gambar[1]);
        setImageLama1(getDetailJerseyResult.gambar[0]);
        setImageLama2(getDetailJerseyResult.gambar[1]);
        setNama(getDetailJerseyResult.nama);
        setBerat(getDetailJerseyResult.berat);
        setHarga(getDetailJerseyResult.harga);
        setJenis(getDetailJerseyResult.jenis);
        setUkuranSelected(getDetailJerseyResult.ukuran);
        setReady(getDetailJerseyResult.ready);
        setLiga(getDetailJerseyResult.liga);      
      }
      
    },[getDetailJerseyResult, updateJerseyResult])

    useEffect(() => {
      if (uploadJerseyResult.imageToDB === "imageToDB1") setImageToDB1(uploadJerseyResult.image)
      if (uploadJerseyResult.imageToDB === "imageToDB2") setImageToDB2(uploadJerseyResult.image)
    },[uploadJerseyResult])
console.log(image1, 'oooo')
    const handleImage = (event, imageToDB) => {
      if (event.target.files && event.target.files[0]) {
        const gambar = event.target.files[0];
        if (imageToDB == "imageToDB1") setImage1(URL.createObjectURL(gambar));
        if (imageToDB == "imageToDB2") setImage2(URL.createObjectURL(gambar));
        dispatch(uploadJersey(gambar, imageToDB));
      }
    };
    
    const handleCheck = (event) => {
      const checked = event.target.checked;
      const value = event.target.value;
      if (checked) {
        //jika user ceklis ukuran
        //isi state array ukuran selected
        setUkuranSelected([...ukuranSelected, value]);
      } else {
        //jika user menghapus ceklis ukuran
        const ukuranBaru = ukuranSelected
          .filter((ukuran) => ukuran !== value)
          .map((filterUkuran) => {
            return filterUkuran;
          });
        setUkuranSelected(ukuranBaru);
      }
    };

  const handleSubmit = (event) => {
    const dataSubmit = {
      berat: berat,
      harga: harga,
      nama: nama,
      liga: liga,
      ukuranSelected: ukuranSelected,
      jenis: jenis,
      imageToDB1: imageToDB1,
      imageToDB2: imageToDB2,
      imageLama1: imageLama1,
      imageLama2: imageLama2,
      ready: ready,
      id: id
    }
    event.preventDefault();
    if (nama && liga && harga && berat && ukuranSelected && jenis) {
      //action
      dispatch(updateJersey(dataSubmit, history)); 
    } else {
      swal("Failed", "Maaf semua form wajib diisi", "error");
    }
  };

  const handleEditUkuran = () => {
    setEditUkuran(true);
    setUkuranSelected([]);
  };

  return (
    <div className="content">
      <Row>
        <Col>
          <Link to="/admin/jersey" className="btn btn-primary">
            Kembali
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardHeader tag="h4">Edit Jersey</CardHeader>
            <CardBody>
              <form onSubmit={(event) => handleSubmit(event)}>
                <Row>
                  <Col md={6}>
                    <Row>
                      <Col>
                        <img
                          src={image1}
                          width="300"
                          alt="Foto Jersey (Depan)"
                        />
                        <FormGroup>
                          <label>Foto Jersey (Depan)</label>
                          <Input
                            type="file"
                            name="image1"
                            onChange={(event) => handleImage(event, "imageToDB1")}
                          />
                        </FormGroup>
                        {image1 !== imageLama1 ? (
                          //selesai upload / proses upload
                          imageToDB1 ? (
                            <p>
                              <i className="nc-icon nc-check-2"></i> Selesai
                              Upload
                            </p>
                          ) : (
                            <p>
                              <i className="nc-icon nc-user-run"></i> Proses
                              Upload
                            </p>
                          )
                        ) : (
                          //belum upload
                          <p>
                            <i className="nc-icon nc-cloud-upload-94"></i>{" "}
                            Belum Upload
                          </p>
                        )}
                      </Col>
                      <Col>
                        <img
                          src={image2}
                          width="300"
                          alt="Foto Jersey (Belakang)"
                        />
                        <FormGroup>
                          <label>Foto Jersey (Belakang)</label>
                          <Input
                            type="file"
                            name="image2"
                            onChange={(event) =>
                              handleImage(event, "imageToDB2")
                            }
                          />
                        </FormGroup>
                        {image2 !== imageLama2 ? (
                          //selesai upload / proses upload
                          imageToDB2 ? (
                            <p>
                              <i className="nc-icon nc-check-2"></i> Selesai
                              Upload
                            </p>
                          ) : (
                            <p>
                              <i className="nc-icon nc-user-run"></i> Proses
                              Upload
                            </p>
                          )
                        ) : (
                          //belum upload
                          <p>
                            <i className="nc-icon nc-cloud-upload-94"></i>{" "}
                            Belum Upload
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <label>Nama Jersey</label>
                      <Input
                        type="text"
                        value={nama}
                        name="nama"
                        onChange={(event) => setNama(event.target.value)}
                      />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <label>Liga</label>
                          <Input
                            type="select"
                            name="liga"
                            value={liga}
                            onChange={(event) => setLiga(event.target.value)}
                          >
                            <option value="">--Pilih--</option>
                            {Object.keys(getListLigaResult).map((key) => (
                              <option value={key} key={key}>
                                {getListLigaResult[key].namaLiga}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <label>Harga (Rp.)</label>
                          <Input
                            type="number"
                            value={harga}
                            name="harga"
                            onChange={(event) => setHarga(event.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <label>Berat (kg)</label>
                          <Input
                            type="number"
                            value={berat}
                            name="berat"
                            onChange={(event) => setBerat(event.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <label>Jenis</label>
                          <Input
                            type="text"
                            value={jenis}
                            name="jenis"
                            onChange={(event) => setJenis(event.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <label>
                          Ukuran Yang Tersedia Sekarang : (
                          {ukuranSelected.map((item, index) => (
                            <strong key={index}> {item} </strong>
                          ))}
                          )
                        </label>
                        {editUkuran ? (
                          <>
                            <FormGroup check>
                              {ukurans.map((ukuran, index) => (
                                <Label key={index} check className="mr-2">
                                  <Input
                                    type="checkbox"
                                    value={ukuran}
                                    onChange={(event) =>
                                      handleCheck(event)
                                    }
                                  />
                                  {ukuran}
                                  <span className="form-check-sign">
                                    <span className="check"></span>
                                  </span>
                                </Label>
                              ))}
                            </FormGroup>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() =>
                                setEditUkuran(false)
                              }
                            >
                              Selesai Edit Ukuran
                            </Button>
                          </>
                        ) : (
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleEditUkuran()}
                          >
                            Edit Ukuran
                          </Button>
                        )}
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <label>Ready</label>
                          <Input
                            type="select"
                            name="ready"
                            value={ready}
                            onChange={(event) => setReady(event.target.value)}
                          >
                            <option value={true}>Ada</option>
                            <option value={false}>Kosong</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    {updateJerseyLoading ? (
                      <Button
                        type="submit"
                        color="primary"
                        className="float-right"
                        disabled
                      >
                        <Spinner size="sm" color="light" /> Loading . . .
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        color="primary"
                        className="float-right"
                      >
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

export default EditJersey;
