//Самовызывающаяся функция / Immediately Invoked Function Expression (IIFE)
(function () {
  //создаем и возвращаем заголовок приложения
  //передаем заголовок в аргументе функции, чтобы можно было его изменить
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

  //создаем и возвращем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    //создаем функцию для проверки значения поля ввода и устновки состояния disabled для кнопки
    //trim - убирает отступы
    function checkInputValue() {
      if (input.value.trim() === '') {
        button.disabled = true;
      }
      else {
        button.disabled = false;
      }
    };

    //добавляем обработчик событий на поле ввода
    input.addEventListener('input', checkInputValue);

    return {
      form,
      input,
      button,
      //вызываем функцию проверки поля ввода
      checkInputValue,
    };
  };

  //Создаем и возвращем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  //создаем и возвращем элемент списка дел
  function createTodoitem(taskObj) {
    let item = document.createElement('li');
    //кнопки помещаем в контейнер, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    if (taskObj.done) {
      item.classList.add('list-group-item-success');
    }
    //устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = taskObj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    //вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function saveDataToLocalStorage(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
  };

  function getDatafromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  };

  //создаем массив в который будут добавляться дела ввиде объектов
  let tasksArr = [];

  let listName = '';

  //создаем функцию списка дел
  function createTodoApp(container, title = 'Список дел', key) {
    listName = key;

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // Проверяем наличие данных в Local Storage при загрузке страницы
    let savedTasks = getDatafromLocalStorage(listName);
    if (savedTasks) {
      tasksArr = savedTasks;
      console.log(tasksArr);
      // Выводим сохраненные задачи на экран
      tasksArr.forEach(taskObj => {
        let todoItem = createTodoitem(taskObj);

        // Добавляем обработчики на кнопки "готово" и "удалить" для каждой сохраненной задачи
        todoItem.doneButton.addEventListener('click', function () {
          todoItem.item.classList.toggle('list-group-item-success')
          taskObj.done = !taskObj.done;
          saveDataToLocalStorage(listName, tasksArr);
          console.log('Обновленный массив', tasksArr);
        });

        todoItem.deleteButton.addEventListener('click', function () {
          if (confirm('Вы уверены?')) {
            // находим id объекта в массиве и записываем его в переменную
            let taskId = taskObj.id;
            todoItem.item.remove();
            tasksArr = tasksArr.filter(el => el.id !== taskId);
            saveDataToLocalStorage(listName, tasksArr);
            console.log('Обновленный массив', tasksArr);
          }
        });

        // Добавляем сохраненную задачу в список
        todoList.append(todoItem.item);
      });
    }

    //добавляем обработчик событий на кнопку у формы;
    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    //e (или event) это объект, который представляет собой событие отправки формы (submit)
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима, чтобы предотвратить стандартное действие браузера
      //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      };

      //создаем функцию для генерирования случайного id для дела
      function generateRandomTaskId() {
        let randomTaskId = Math.floor(Math.random() * 100);
        return randomTaskId
      };

      //создаем объект для функции создания дела, done: false, потому что дело еще не выполнено
      let taskObj = {
        id: generateRandomTaskId(),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoitem(taskObj);
      tasksArr.push(taskObj);
      saveDataToLocalStorage(listName, tasksArr);

      console.log(tasksArr);

      //добавляем обработчики на кнопки "готово" и "удалить"
      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success')
        taskObj.done = !taskObj.done;
        saveDataToLocalStorage(listName, tasksArr);
        console.log('Обновленный массиив', tasksArr);
      });

      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          // находим id объекта в массиве и записываем его в переменную
          let taskId = taskObj.id;
          todoItem.item.remove();
          tasksArr = tasksArr.filter(el => el.id !== taskId);
          saveDataToLocalStorage(listName, tasksArr);
          console.log('Обновленный массиив', tasksArr);
        }
      });

      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      //обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';

      //вызываем функцию checkInputValue в конце обработчика события submit, чтобы убедиться, что кнопка блокируется или разблокируется после добавления нового задания.
      todoItemForm.checkInputValue();
    })
  }

  window.createTodoApp = createTodoApp;
})();

