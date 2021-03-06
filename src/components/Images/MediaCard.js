import * as React from "react";
// redux
import { connect } from "react-redux";
import { compose } from "redux";

import { Modal } from "@mui/material";
import { withStyles } from "@material-ui/core/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ButtonBase from "@material-ui/core/ButtonBase";
import FavoriteIcon from "@mui/icons-material/Favorite";

import * as actionTypes from "../../store/actions";
import * as api from "../api/actions";
import VideoDetail from "../Videos/Details";
import PathParser from "../../Utils/PathParser";
import { Chip } from "@material-ui/core";

const styles = {
  clickableImage: {
    display: "block",
    textAlign: "initial",
    width: "100%",
  },
  CardContent: {
    inlineSize: "95%",
    padding: "9px !important",
    overflowWrap: "break-word",
  },
  cardActions: {
    gridColumnGap: "10px",
    flexDirection: "row-reverse",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  categories: {
    direction: "rtl",
    marginTop: 0,
  },
  chip: {
    backgroundColor: "#E8E8E8",
    color: "#ea00d9",
    width: "auto",
    marginTop: 0,
    marginLeft: 5,
    fontSize: 12,
    height: 18,
  },
};

function MediaCard(props) {
  const video = props.video;
  const [isFavorite, setIsFavorite] = React.useState(video.favorite);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  const { classes } = props;

  const getFavoriteColor = (favorite) => {
    if (favorite) {
      return "error";
    }
    return "disabled";
  };

  const handleOnClickFavorite = (id) => {
    api.updateFavoriteApi(id);
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
  };

  const handleShowDetailModal = () => {
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  React.useEffect(async () => {
    const video = props.video;
    const categories = await api.getVideoCategoriesApi(video.id);
    setCategories(categories);
  }, []);

  return (
    <>
      <Card sx={{ width: "25%" }}>
        <ButtonBase
          className={classes.clickableImage}
          onClick={() => props.onClickMediaCard(video)}
        >
          <CardMedia
            component="img"
            height="200"
            image={`${PathParser.getRelativePath(video)}/${
              video.thumbnail
            }?w=248&fit=crop&auto=format`}
            alt="green iguana"
          />
          <IconButton
            aria-label="play/pause"
            onClick={() => props.onClickMediaCard(video)}
            style={{ position: "absolute", top: "30%", left: "40%" }}
          >
            <PlayArrowIcon
              sx={{
                height: 50,
                width: 50,
                color: "#fff",
                backgroundColor: "hsl(210deg 8% 55%)",
                borderRadius: "50%",
              }}
            />
          </IconButton>
        </ButtonBase>
        <CardContent className={classes.CardContent}>
          <Typography gutterBottom variant="h6" component="div">
            {video.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {video.folder}
          </Typography>
          <CardActions
            className={classes.cardActions}
            style={{ textAlign: "end !important" }}
          >
            <IconButton aria-label="add to favorites">
              <FavoriteIcon
                color={getFavoriteColor(isFavorite)}
                onClick={() => handleOnClickFavorite(video.id)}
              />
            </IconButton>
            <IconButton
              aria-label={`info about ${video.title}`}
              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              onClick={() => handleShowDetailModal(video)}
            >
              <InfoIcon />
            </IconButton>
          </CardActions>
          <div className={classes.categories}>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <Chip
                    label={category.category_name}
                    className={classes.chip}
                  />
                );
              })}
          </div>
        </CardContent>
      </Card>
      <Modal
        open={showDetailModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <VideoDetail video={props.video} />
      </Modal>
    </>
  );
}

export default withStyles(styles)(MediaCard);
