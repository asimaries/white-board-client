"use client";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./index.module.css";
import { MENU_ITEMS } from "@/constants";
import { menuItemClick, actionItemClick } from "@/store/slice/MenuSlice";
import { RootState } from "@/store";
import { useState } from "react";

export default function Menu() {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector(
    (state: RootState) => state.menu.activeMenuItem
  );

  const handleMenuClick = (item: string) => {
    dispatch(menuItemClick(item));
  };

  const handleActioItemClick = (itemName: string) => {
    dispatch(actionItemClick(itemName));
  };

  const disableButton = useSelector(
    (state: RootState) => state.menu.disableButton
  );
  // console.log(disableButton);

  return (
    <div className={styles.menuContainer}>
      <button
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
        })}
        onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
      >
        <FontAwesomeIcon icon={faPencil} />
      </button>
      <button
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
        })}
        onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
      <button
        className={styles.iconWrapper}
        onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
        disabled={disableButton[0]}
      >
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
      </button>
      <button
        className={styles.iconWrapper}
        onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
        disabled={disableButton[1]}
      >
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
      </button>
      <button
        className={styles.iconWrapper}
        onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
      >
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
      </button>
    </div>
  );
}
