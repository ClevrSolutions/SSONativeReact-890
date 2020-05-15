import { Component, createElement } from "react";
import { View } from "react-native";
//important! Since Mendix uses and packages an older version of this webview we must specify the correct one from our installed package...
//import /*WebView, */ { WebView as RNWebView, WebViewNavigation } from "../node_modules/react-native-webview";
import /*WebView, */ { WebView as RNWebView, WebViewNavigation } from "react-native-webview";
import { ActionValue /*, DynamicValue, EditableValue, ValueStatus*/ } from "mendix";

import { SSONativeReactProps } from "../typings/SSONativeReactProps";
import { flattenStyles, defaultWebViewStyle, WebViewStyle } from "./utils/common";
//import { WebViewMessage } from "react-native-webview/lib/WebViewTypes";
//import { NativeSyntheticEvent } from "react-native";


interface SSONativeReactState {
    currentUrl: String;
}


export class SSONativeReact extends Component<SSONativeReactProps<WebViewStyle>, SSONativeReactState> {
    
    state: SSONativeReactState = {
        currentUrl: ""
    };
    
    private readonly onLoadHandler = this.onLoad.bind(this);
    private readonly onErrorHandler = this.onError.bind(this);
    private readonly onCallbackHandler = this.onCallback.bind(this);
    //private readonly onMessageHandler = this.onMessage.bind(this);
    private readonly onNavigationStateChangeHandler = this.onNavigationStateChange.bind(this);

    private readonly styles = flattenStyles(defaultWebViewStyle, this.props.style);

     private webview: RNWebView | null = null;
     private shouldRender = true;
     //private messagePromise: Promise<Object> | null = null;

    render(): JSX.Element {
        const uri = this.props.url.value;
        console.log("rendering (initial url)",uri, this.shouldRender);
        const containernode = this.shouldRender && uri ? <View 
            style={this.styles.container}
        >
            <RNWebView
                ref={ref => (this.webview = ref)}
                testID={this.props.name}
                source={{uri: uri! }}
                style={{
                    width: "100%",
                    height: "100%"
                }}
                onLoadEnd={this.onLoadHandler}
                onError={this.onErrorHandler}
                onNavigationStateChange={this.onNavigationStateChangeHandler}
                /*onMessage={this.onMessageHandler}*/
                sharedCookiesEnabled={true} /* voor iOS */
            />
        </View> : <View/>;
        return containernode;
    }

    componentDidUpdate(prevProps: SSONativeReactProps<WebViewStyle>) {
        console.log("componentDidUpdate curr, prev",this.props.url, prevProps.url);
        if(!prevProps.url) {
            this.setState({
                currentUrl: this.props.url && this.props.url.value ? this.props.url.value : ""
            });
        }
        console.log("props url", this.props.url);
    }

    private onLoad(): void {
        console.log("page loaded", this.state.currentUrl);
        if(this.props.regexOnLoadInclude && this.props.regexOnLoadInclude.value) {
            const url: string = (this.state.currentUrl ? this.state.currentUrl : "") as string;
            if(new RegExp(this.props.regexOnLoadInclude.value).test(url)) {
                this.executeAction(this.props.onLoad);
            }
        } else {
            this.executeAction(this.props.onLoad);
        }
    }

    private onError(): void {
        this.executeAction(this.props.onError);
    }

    private onCallback(): void {
        console.log("on Callback");
        this.executeAction(this.props.onCallback);
    }

    /*
    private onMessage(event: NativeSyntheticEvent<WebViewMessage>) {
        console.log("ONMESSAGE");
        const { data } = event.nativeEvent;        
        const cookies  = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`    
        cookies.forEach((cookie: String) => {
          const c = cookie.trim().split('=');
          const new_cookies: any = this.state.cookies;
          new_cookies[c[0]] = c[1];
          this.setState({ cookies: new_cookies });
        });
        console.log("COOKIES",this.state.cookies);        
    }
    */

    private onNavigationStateChange (newNavState: WebViewNavigation) : void {
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }

        const { url } = newNavState;
        this.setState({
            currentUrl: url
        });

        console.log("URL",url);
        //const jsCode = "window.ReactNativeWebView.postMessage(document.cookie); true;";
        //this.webview && this.webview.injectJavaScript(jsCode);
        let includes = true;
        let excludes = false;
        if(this.props.regexInclude && this.props.regexInclude.value) {
            includes = new RegExp(this.props.regexInclude.value).test(url);
        }
        if(this.props.regexExclude && this.props.regexExclude.value) {
            excludes = new RegExp(this.props.regexExclude.value).test(url);
        }
        console.log("includes, excludes:", includes, excludes);
        if(includes && !excludes) {
            this.props.callback.setTextValue(url);
            this.onCallbackHandler();
            if(this.webview) {
                console.log("loading stopped");
                this.webview && this.webview.stopLoading();
                this.shouldRender = false;
            }
        }
        /*
        if(url.includes("callback") && !url.includes("oauth2")) {
        }
        /*
        // redirect somewhere else
        if (url.includes('google.com')) {
            const newURL = 'https://reactnative.dev/';
            const redirectTo = 'window.location = "' + newURL + '"';
            this.webview && this.webview.injectJavaScript(redirectTo);
        }
        */
    }

    private executeAction = (action?: ActionValue): void => {
        if (action && action.canExecute && !action.isExecuting) {
            action.execute();
        }
    };
}
