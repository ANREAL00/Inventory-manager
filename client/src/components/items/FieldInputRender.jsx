import { StringInput, NumberInput, BoolInput, DateInput, ImageInput } from './FieldInputs';

const components = { STRING: StringInput, TEXT: StringInput, NUMBER: NumberInput, BOOLEAN: BoolInput, DATE: DateInput, IMAGE: ImageInput };

export function FieldInputRender({ field, value, onChange }) {
    const Component = components[field.type];
    if (!Component) return null;
    return <Component field={field} value={value} onChange={onChange} />;
}
