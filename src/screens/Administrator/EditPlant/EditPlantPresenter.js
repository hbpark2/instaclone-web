/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import Layout from 'components/Layout/Layout';
import { PageTitle } from 'components/common/PageTitle';
import Logo from 'assets/hwamoak_logo.png';
import Input from 'components/auth/Input';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import Button from 'components/auth/Button';
import WaterIcon from 'assets/water-drop.png';
import SunriseIcon from 'assets/sunrise.png';
import { useHistory } from 'react-router';
import Gauge from '../UploadPlant/components/Gauge';
import Loading from '../../../components/common/Loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination]);

const Container = styled.div`
  padding-bottom: 30px;
`;
const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid ${props => props.theme.borderColor2};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled.span`
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const SLogo = styled.img`
  display: block;
  /* width: 40px; */
  width: 115px;
  margin: 0 auto;
`;

const UploadPlantWrap = styled.div`
  margin: 30px;
  input {
    display: none;
  }
`;

const UploadPlantLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.borderColor2};
  border-radius: 35px;
  cursor: pointer;
`;

const Form = styled.form`
  margin: 30px 0;
`;

const PlantImagesWrap = styled.div`
  margin: 30px auto;

  .swiper-button-prev::after,
  .swiper-button-next::after {
    color: #333;
    /* font-size: 16px !important; */
  }
  .swiper-pagination-bullet {
    background: #333;
    width: 7px;
    height: 7px;
  }
  .swiper-slide {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      display: block;
      width: 300px;
    }
  }
`;

const CaptionInput = styled.textarea`
  width: 100%;
  height: 300px;
  border-radius: 3px;
  padding: 7px;
  /* background-color: #fafafa; */
  background-color: ${props => props.theme.beige2};
  border: 0.5px solid
    ${props => (props.hasError ? 'tomato' : props.theme.borderColor2)};
  margin-top: 5px;
  box-sizing: border-box;
  transition: border-color 0.5s;
  resize: none;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    outline: none;
    border-color: rgba(38, 38, 38);
  }
`;

const IconWrap = styled.ul`
  /* width: 80%; */
  margin: 30px auto;
  img {
    display: block;
    width: 80px;
  }
`;

const Details = styled.li`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const Icon = styled.div``;
const Percentage = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-weight: 700;
`;

const ImageItem = styled.div``;

const DeleteButton = styled.button`
  padding: 5px;
  cursor: pointer;
`;

const TemperatureInput = styled(Input)`
  margin-top: 0;
  border: none;
`;

const DetailInputWrap = styled.div`
  display: flex;
  margin-top: 10px;
  input {
    margin: 5px;
  }
`;

const TemperatureWrap = styled.div`
  margin: 30px auto;
  .temperature_box {
    display: flex;
  }
`;

const TemperatureLabel = styled.label`
  display: flex;
  align-items: center;
  width: 80%;
  input {
    width: 35px;
  }
  i {
    display: block;
    margin: 0 5px;
  }
  span {
    display: block;
    /* text-align: center; */
    /* width: 100px; */
    width: 80px;
  }

  .tem {
    display: inline;
    width: auto;
    margin-left: 5px;
    font-weight: 700;
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Message = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: tomato;
`;

const EDIT_PLANT_MUTATION = gql`
  mutation editPlant(
    $id: Int!
    $title: String!
    $caption: String
    $images: [Upload]!
    $originalImages: [String]!
    $sunlight: Int
    $temperatureMin: Int
    $temperatureMax: Int
    $water: Int
    $plantDivision: String
    $plantClass: String
    $plantOrder: String
    $plantFamily: String
    $plantGenus: String
    $plantSpecies: String
    $plantHome: String
    $plantHabitat: String
  ) {
    editPlant(
      id: $id
      title: $title
      caption: $caption
      images: $images
      originalImages: $originalImages
      sunlight: $sunlight
      temperatureMin: $temperatureMin
      temperatureMax: $temperatureMax
      water: $water
      plantDivision: $plantDivision
      plantClass: $plantClass
      plantOrder: $plantOrder
      plantFamily: $plantFamily
      plantGenus: $plantGenus
      plantSpecies: $plantSpecies
      plantHome: $plantHome
      plantHabitat: $plantHabitat
    ) {
      ok
      error
    }
  }
`;
const DELETE_PLANTIMAGE_MUTATION = gql`
  mutation deletePlantImage($id: Int!) {
    deletePlantImage(id: $id) {
      ok
      error
    }
  }
`;

const EditPlantPresenter = ({
  id,
  user,
  images,
  title,
  caption,
  water,
  sunlight,
  temperatureMin,
  temperatureMax,
  plantDivision,
  plantClass,
  plantOrder,
  plantFamily,
  plantGenus,
  plantSpecies,
  plantHome,
  plantHabitat,
  isLiked,
  plantLikes,
}) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [oldPreviewPhotos, setOldPreviewPhotos] = useState([]);
  const [oldFileList, setOldFileList] = useState([]);
  const [awater, setWater] = useState(water);
  const [asunlight, setSunlight] = useState(sunlight);
  const [imgLoading, setImgLoading] = useState(false);

  // const [atemperature, setTemperature] = useState(temperature);
  const history = useHistory();

  useEffect(() => {
    let fileListArr = [];
    let previewArr = [];

    // eslint-disable-next-line array-callback-return
    images.map(item => {
      fileListArr.push(item.file);
      previewArr.push({ src: item.file, id: item.id });

      setOldFileList(fileListArr);
      setOldPreviewPhotos(previewArr);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //CAPTION 만들기
  const defaultCaptionArr = caption.split('<br />').map((line, index) => {
    return `${line} \n`;
  });
  const defaultCaption = defaultCaptionArr.join().replaceAll(',', '');

  const onCompleted = data => {
    history.push(`/plants/${id}`);
  };

  const [editPlant, { loading }] = useMutation(EDIT_PLANT_MUTATION, {
    onCompleted,
  });

  const onFileChange = async e => {
    const {
      target: { files },
    } = e;

    //미리보기 이미지
    let fileURLs = [];

    let file;
    let filesLength = files.length > 10 ? 10 : files.length;

    for (let i = 0; i < filesLength; i++) {
      file = files[i];

      let reader = new FileReader();
      reader.onload = () => {
        fileURLs[i] = reader.result;
        setPreviewPhotos([...previewPhotos, { src: fileURLs }]);
      };
      reader.readAsDataURL(file);
    }

    if (files.length > 0) {
      //  파일 확장자 && 용량 체크
      const file = files[0];
      setFileList([...fileList, file]);
    }
    // setImgLoading(true);
    return null;
  };

  const onDeleteButtonClick = (e, idx, imageId) => {
    e.preventDefault();
    // console.log(imageId);
    if (imageId) {
      setOldPreviewPhotos(prev => prev.filter((_, index) => index !== idx));
      setOldFileList(prev => prev.filter((_, index) => index !== idx));
    } else {
      setPreviewPhotos(prev => prev.filter((_, index) => index !== idx));
      setFileList(prev => prev.filter((_, index) => index !== idx));
    }

    // deletePlantImage({ variables: { id: imageId } });
    // console.log(imageId);
  };

  const onValid = data => {
    let str = data.caption;
    let captionRemake = str.replace(/(?:\r\n|\r|\n)/g, '<br />');

    editPlant({
      variables: {
        id: id,
        title: data.title,
        caption: captionRemake,
        originalImages: oldFileList,
        images: fileList,
        water: awater,
        sunlight: asunlight,
        temperatureMin: parseInt(data.temperatureMin),
        temperatureMax: parseInt(data.temperatureMax),
        plantDivision: data.plantDivision,
        plantClass: data.plantClass,
        plantOrder: data.plantOrder,
        plantFamily: data.plantFamily,
        plantGenus: data.plantGenus,
        plantSpecies: data.plantSpecies,
        plantHome: data.plantHome,
        plantHabitat: data.plantHabitat,
      },
    });
    window.alert('Edit Complete');
  };

  const checkInputNum = e => {
    if (e.keyCode < 48 || e.keyCode > 57) {
      e.returnValue = false;
    }
  };

  return (
    <Container>
      <PageTitle title="Upload Plant" />

      <Layout>
        <FormWrapper>
          <HeaderContainer>
            <SLogo src={Logo} alt="화목" />
            <Subtitle>
              Upload Plant for see photos and videos from your friends.
            </Subtitle>
          </HeaderContainer>

          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              ref={register({
                required: 'Title is required.',
              })}
              name="title"
              type="text"
              placeholder="Title"
              defaultValue={title}
            />
            <CaptionInput
              ref={register({
                required: 'caption is required.',
              })}
              name="caption"
              type="text"
              placeholder="Caption"
              defaultValue={defaultCaption}
            />

            <DetailInputWrap>
              <Input
                ref={register({ required: false })}
                name="plantDivision"
                type="text"
                placeholder="문"
                defaultValue={plantDivision}
              />
              <Input
                ref={register({ required: false })}
                name="plantClass"
                type="text"
                placeholder="강"
                defaultValue={plantClass}
              />
              <Input
                ref={register({ required: false })}
                name="plantOrder"
                type="text"
                placeholder="목"
                defaultValue={plantOrder}
              />
              <Input
                ref={register({ required: false })}
                name="plantFamily"
                type="text"
                placeholder="과"
                defaultValue={plantFamily}
              />
              <Input
                ref={register({ required: false })}
                name="plantGenus"
                type="text"
                placeholder="속"
                defaultValue={plantGenus}
              />
              <Input
                ref={register({ required: false })}
                name="plantSpecies"
                type="text"
                placeholder="종"
                defaultValue={plantSpecies}
              />
              <Input
                ref={register({ required: false })}
                name="plantHome"
                type="text"
                placeholder="원산지"
                defaultValue={plantHome}
              />
              <Input
                ref={register({ required: false })}
                name="plantHabitat"
                type="text"
                placeholder="서식지"
                defaultValue={plantHabitat}
              />
            </DetailInputWrap>

            <TemperatureWrap>
              <div className="temperature_box">
                <TemperatureLabel>
                  <span>적정온도</span>
                  <TemperatureInput
                    ref={register({
                      required: 'Temperature is required.',
                      validate: value => {
                        return (
                          !parseInt(value) > 0 ||
                          !parseInt(value) < 40 ||
                          '10보다크고 40보다작아야해'
                        );
                      },
                    })}
                    defaultValue={temperatureMin}
                    name="temperatureMin"
                    min="0"
                    max="40"
                    type="number"
                    onKeyPress={checkInputNum}
                  />
                  &nbsp;<span className="tem">℃</span>
                  <i>~</i>
                  <TemperatureInput
                    ref={register({
                      required: 'Temperature is required.',
                      validate: value => {
                        return (
                          !parseInt(value) > 0 ||
                          !parseInt(value) < 40 ||
                          '10보다크고 40보다작아야해'
                        );
                      },
                    })}
                    defaultValue={temperatureMax}
                    name="temperatureMax"
                    min="0"
                    max="40"
                    type="number"
                    onKeyPress={checkInputNum}
                  />
                  &nbsp;<span className="tem">℃</span>
                </TemperatureLabel>
              </div>
              <Message>
                {(errors.temperatureMin || errors.temperatureMax) &&
                  '적정온도를 작성해주세요'}
              </Message>
            </TemperatureWrap>

            <UploadPlantWrap>
              {imgLoading ? (
                <Loading />
              ) : (
                <PlantImagesWrap>
                  <Swiper
                    navigation
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                  >
                    {oldPreviewPhotos.map((item, index) => {
                      let makeKey = index;
                      return (
                        <SwiperSlide key={makeKey}>
                          {/* <ImageItem> */}
                          <img src={item.src} alt="" />
                          <DeleteButton
                            onClick={e =>
                              onDeleteButtonClick(e, index, item.id)
                            }
                          >
                            삭제
                          </DeleteButton>
                          {/* </ImageItem> */}
                        </SwiperSlide>
                      );
                    })}

                    {previewPhotos.map((item, index) => {
                      let makeKey = index;
                      return (
                        <SwiperSlide key={makeKey}>
                          {/* <ImageItem> */}
                          <img src={item.src} alt="" />
                          <DeleteButton
                            onClick={e =>
                              onDeleteButtonClick(e, index, item.id)
                            }
                          >
                            삭제
                          </DeleteButton>
                          {/* </ImageItem> */}
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </PlantImagesWrap>
              )}
              <UploadPlantLabel htmlFor="imageUpload">
                <FontAwesomeIcon icon={faPlus} />
                {/* {console.log(fileList.length)} */}
                <input
                  ref={register(
                    images.length > 0
                      ? null
                      : {
                          required: 'Image is required.',
                        },
                  )}
                  name="image"
                  type="file"
                  accept=" .jpg, .png"
                  multiple
                  onChange={onFileChange}
                  id="imageUpload"
                />
              </UploadPlantLabel>

              <IconWrap>
                <Details>
                  <Icon>
                    <img src={WaterIcon} alt="" />
                    <Percentage>{awater}%</Percentage>
                  </Icon>
                  <Gauge
                    bgColor={props => props.theme.waterColor}
                    accentColor={props => props.theme.waterAccentColor}
                    background={props => props.theme.waterGradient}
                    percentage={awater}
                    setGauge={setWater}
                  />
                </Details>
                <Details>
                  <Icon>
                    <img src={SunriseIcon} alt="" />
                    <Percentage>{asunlight}%</Percentage>
                  </Icon>
                  <Gauge
                    bgColor={props => props.theme.sunlightColor}
                    accentColor={props => props.theme.sunlightAccentColor}
                    background={props => props.theme.sunlightGradient}
                    percentage={asunlight}
                    setGauge={setSunlight}
                  />
                </Details>
                {/* <Details>
                  <Icon>
                    <img src={TemperatureIcon} alt="" />
                    <Percentage>{atemperature}%</Percentage>
                  </Icon>
                  <Gauge
                    bgColor={props => props.theme.temperatureColor}
                    accentColor={props => props.theme.temperatureAccentColor}
                    background={props => props.theme.temperatureGradient}
                    percentage={atemperature}
                    setGauge={setTemperature}
                  />
                </Details> */}
              </IconWrap>
            </UploadPlantWrap>
            <Button
              type="submit"
              value={loading ? 'Loading...' : 'POST'}
              disabled={!formState.isValid || loading}
            />
          </Form>
        </FormWrapper>
      </Layout>
    </Container>
  );
};

export default EditPlantPresenter;
