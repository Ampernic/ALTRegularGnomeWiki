# Xeyes
Xeyes — программа, которая отображает на экране два глаза, следящих за движениями курсора мыши, как если бы они наблюдали за ними.

Программу можно использовать как индикацию того, использует ли окно протокол Wayland:

- если при перемещении курсора в окне глаза **двигаются**, окно использует **X11**
- если глаза **не двигаются**, окно использует **Wayland**

![xeyes1.png](/xeyes/xeyes1.png)

## Установка из репозитория

**Установка через терминал**

**NAME** можно установить через терминал:

::: code-group

```shell[apt-get]
su -
apt-get update
apt-get install xeyes
```
```shell[epm]
epm -i xeyes
```

:::