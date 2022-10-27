const addbtngrp = document.querySelectorAll(".add-btn");
const savebtngrp = document.querySelectorAll(".save-btn");
let dragItems;
const trashbtngrp = document.querySelectorAll(".trash-btn");
const newItemContainers = document.querySelectorAll(".new-item-container");
const closeBtnGrp = document.querySelectorAll(".fa-xmark");
// Item lists
const dragItemContainer = document.querySelectorAll(".drag-item-list");
const dragColumns = document.querySelectorAll(".drag-column");
const backlogList = document.querySelector("#backlog-list");

const inprogressList = document.querySelector("#inprogress-list");
const completeList = document.querySelector("#complete-list");
const onholdList = document.querySelector("#onhold-list");

// List Arrays
let backlogListArray = [];
let inprogressListArray = [];
let completeListArray = [];
let onholdListArray = [];
let listsArray = [];

// Global Variable

let draggedItem;
let currentColumn;
let currentTrashBtn;
let isDragging = false;

// Get Arrays from localstorage if available, set default if not

const getSavedColumns = () => {
  backlogListArray = ["Release the course", "Sit back and relax"];
  inprogressListArray = ["Work on projects", "Listen to music"];
  completeListArray = ["Being cool", "Getting stuff done"];
  onholdListArray = ["Being uncool"];
  console.log(backlogListArray);
  if (true) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    inprogressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onholdListArray = JSON.parse(localStorage.onholdItems);
  }
  setSavedColumns();
};

// Set localStorage Arrays

const setSavedColumns = () => {
  listsArray = [
    backlogListArray,
    inprogressListArray,
    completeListArray,
    onholdListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onhold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listsArray[index])
    );
  });
  updateDom();
};

// Setup localStorage to page

const updateDom = () => {
  listsArray = [
    backlogListArray,
    inprogressListArray,
    completeListArray,
    onholdListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onhold"];
  if (!isDragging) {
    // Set backlog items
    backlogListArray.forEach((backlogitem) => {
      backlogList.insertAdjacentHTML(
        "beforeend",
        `<li class="drag-item" draggable="true" ondragstart="drag(this)" ondragend="dragEnd()" >${backlogitem}</li>`
      );
    });
    // Set inprogress items
    inprogressListArray.forEach((inprogressitem) => {
      inprogressList.insertAdjacentHTML(
        "beforeend",
        `<li class="drag-item" draggable="true" ondragstart="drag(this)" ondragend="dragEnd()" >${inprogressitem}</li>`
      );
    });
    // Set complete items
    completeListArray.forEach((completeitem) => {
      completeList.insertAdjacentHTML(
        "beforeend",
        `<li class="drag-item" draggable="true" ondragstart="drag(this)" ondragend="dragEnd()" >${completeitem}</li>`
      );
    });
    // Set onhold items
    onholdListArray.forEach((onholditem) => {
      onholdList.insertAdjacentHTML(
        "beforeend",
        `<li class="drag-item" draggable="true" ondragstart="drag(this)" ondragend="dragEnd()" >${onholditem}</li>`
      );
    });
    isDragging = true;
    dragItems = document.querySelectorAll(".drag-item");
  }
};
const dragEnd = async () => {
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove("over");
  });
  dragItemContainer.forEach((dragItem) => {
    dragItem.classList.remove("over");
  });
  trashbtngrp.forEach((trashBtn) => {
    trashBtn.classList.remove("hover");
  });
  currentTrashBtn.hidden = await true;
  addbtngrp.forEach((addBtn) => {
    addBtn.hidden = false;
  });
};

// Start to the drag
const drag = (item) => {
  draggedItem = item;
  currentTrashBtn = item.parentElement.parentElement.querySelector(
    ".button-list .trash-btn"
  );
  currentTrashBtn.hidden = false;
  addbtngrp.forEach((addbtn) => {
    addbtn.hidden = true;
  });
  newItemContainers.forEach((container) => {
    container.style.display = "none";
  });
  savebtngrp.forEach((container) => {
    container.hidden = true;
  });
};

// Column allows for item to drop
const allowDrop = (e) => {
  e.preventDefault();
};

// When item enters column area
const dragEnter = (item) => {
  currentColumn = item.parentElement.parentElement;
  currentTrashBtn = item.parentElement.parentElement.querySelector(
    ".button-list .trash-btn"
  );
  console.log("current column:", currentColumn);
  dragColumns.forEach((dragColumn) => {
    dragColumn.classList.remove("over");
  });
  dragItemContainer.forEach((dragItem) => {
    dragItem.classList.remove("over");
  });
  trashbtngrp.forEach((trashBtn) => {
    console.log(trashBtn);
    trashBtn.classList.remove("hover");
    trashBtn.hidden = true;
  });

  currentTrashBtn.hidden = false;
  currentColumn.classList.add("over");
  item.classList.add("over");
  console.log(item);
};

// Finish to the drag
const drop = (e) => {
  e.preventDefault();
  console.log("dropped");
  // draggedItem = JSON.stringify(draggedItem);
  draggedItem.remove();

  // Delete the dragged item in the local storage

  draggedItem = draggedItem.outerHTML;

  currentColumn
    .querySelector("div ul")
    .insertAdjacentHTML("beforeend", draggedItem);

  updateSituation();
  rebuildArrays();
};

// Trash Drag Drop

const dropTrash = () => {
  draggedItem.remove();

  updateSituation();

  rebuildArrays();
};

const dragEnterTrash = (item) => {
  item.classList.add("hover");
};

const dragEndTrash = () => {
  trashbtngrp.forEach((trashBtn) => {
    trashBtn.classList.add("hover");
  });
};

const updateSituation = () => {
  dragItemContainer.forEach((container) => {
    if (container.children.length == 1) {
      container.querySelectorAll("p").forEach((item) => {
        item.hidden = false;
      });
    } else if (container.children.length != 1) {
      container.querySelectorAll("p").forEach((item) => {
        item.hidden = true;
      });
    }
  });
};

const rebuildArrays = () => {
  backlogListArray = [];
  backlogListItems = backlogList.querySelectorAll("li");
  backlogListItems.forEach((item) => {
    backlogListArray.push(item.innerHTML);
  });

  inprogressListArray = [];
  inprogressListItems = inprogressList.querySelectorAll("li");
  inprogressListItems.forEach((item) => {
    inprogressListArray.push(item.innerHTML);
  });

  completeListArray = [];
  completeListItems = completeList.querySelectorAll("li");
  completeListItems.forEach((item) => {
    completeListArray.push(item.innerHTML);
  });

  onholdListArray = [];
  onholdListItems = onholdList.querySelectorAll("li");
  onholdListItems.forEach((item) => {
    onholdListArray.push(item.innerHTML);
  });
  setSavedColumns();
};

addbtngrp.forEach((addbtn) => {
  addbtn.addEventListener("click", () => {
    let addColumn = addbtn.parentElement.parentElement;
    let saveBtn = addColumn.querySelector(".button-list .save-btn");
    let newItemContainer = addColumn.querySelector(".new-item-container");

    savebtngrp.forEach((saveBtn) => {
      saveBtn.hidden = true;
    });
    newItemContainers.forEach((container) => {
      container.style.display = "none";
    });
    addbtngrp.forEach((saveBtn) => {
      saveBtn.hidden = false;
    });
    addbtn.hidden = true;
    saveBtn.hidden = false;
    newItemContainer.style.display = "flex";

    console.log(newItemContainer);
    console.log(addColumn);
    console.log(saveBtn);
  });
});

savebtngrp.forEach((saveBtn) => {
  saveBtn.addEventListener("click", () => {
    listContainer =
      saveBtn.parentElement.parentElement.querySelector(".drag-item-list");
    newItemContainer = saveBtn.parentElement.parentElement.querySelector(
      ".new-item-container .new-item"
    );
    if (newItemContainer.textContent == "") {
      alert("lutfen gecerli bir item giriniz");
    } else {
      listContainer.insertAdjacentHTML(
        "beforeend",
        `<li class="drag-item" draggable="true" ondragstart="drag(this)" ondragend="dragEnd()"  >${newItemContainer.textContent}</li>`
      );
      dragItems = document.querySelectorAll(".drag-item");
      newItemContainer.textContent = "";
      updateSituation();
      rebuildArrays();
    }
  });
});

closeBtnGrp.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    let buttonList =
      closeBtn.parentElement.parentElement.querySelector(".button-list");
    let saveBtn = buttonList.querySelector(".save-btn");
    let addBtn = buttonList.querySelector(".add-btn");
    closeBtn.parentElement.querySelector(".new-item").textContent = "";

    closeBtn.parentElement.style.display = "none";
    saveBtn.hidden = true;
    addBtn.hidden = false;
  });
});

getSavedColumns();
updateSituation();
