/**
 * This file was generated from SSONativeReact.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface SSONativeReactProps<Style> {
    name: string;
    style: Style[];
    callback: EditableValue<string>;
    url: DynamicValue<string>;
    regexInclude?: DynamicValue<string>;
    regexExclude?: DynamicValue<string>;
    regexOnLoadInclude?: DynamicValue<string>;
    onLoad?: ActionValue;
    onError?: ActionValue;
    onCallback?: ActionValue;
}

export interface SSONativeReactPreviewProps {
    class: string;
    style: string;
    callback: string;
    url: string;
    regexInclude: string;
    regexExclude: string;
    regexOnLoadInclude: string;
    onLoad: {} | null;
    onError: {} | null;
    onCallback: {} | null;
}
