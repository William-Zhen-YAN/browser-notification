import * as _ from "lodash"

export interface BrowserNotificationParam {
  title: string;
  message: string;
  icon?: string;
}

export default class BrowserNotification {
  public static askPermission(): Promise<boolean> {
    const handlePermission = (permission: NotificationPermission) => {
      // store choice("default" | "denied" | "granted") of user
      if (!("permission" in Notification)) {
        (Notification as any).permission = permission;
      }
    };

    return new Promise((resolve: any) => {
      if (("Notification" in window)) {
        console.warn("Notification is not supported in current browser.");
        resolve(false);
      } else {
        if (this._checkNotificationPromise()) {
          Notification.requestPermission()
            .then((permission) => {
              handlePermission(permission);
              this._canNotify = permission === "granted";
              resolve(this._canNotify);
            })
            .catch((error) => {
              console.warn("Request permission failed", error);
              resolve(false);
            });
        } else {
          Notification.requestPermission((permission) => {
            handlePermission(permission);
          })
            .then((permission) => {
              this._canNotify = permission === "granted";
              resolve(this._canNotify);
            })
            .catch((error) => {
              console.warn("Request permission failed", error);
              resolve(false);
            });
        }
      }
    });
  }

  public static notify(param: BrowserNotificationParam) {
    if (!this._canNotify) {
      return;
    }
    this._currentNotify = new Notification(param.title, {
      body: param.message,
      icon: param.icon,
    });
  }

  public static debounceNotify(param: BrowserNotificationParam) {
    if (!this._canNotify) {
      return;
    }

    if (!this._debounceNotify) {
      this._debounceNotify = _.throttle(() => {
        if (this._currentNotify) {
          this._currentNotify.close();
        }
        this.notify(param);
      }, 2000);
    }

    this._debounceNotify(param);
  }

  private static _canNotify: boolean = false;
  private static _currentNotify: any = null;
  private static _debounceNotify: any = null;

  private static _checkNotificationPromise(): boolean {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }
    return true;
  }
}
