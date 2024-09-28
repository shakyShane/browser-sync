import { Inputs } from "../index";
import { Observable } from "rxjs/Observable";
import * as KeyupEvent from "../messages/KeyupEvent";
import { tap } from "rxjs/operators/tap";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { EffectNames } from "../effects";

export function setElementValueEffect(
    xs: Observable<KeyupEvent.IncomingPayload>,
    inputs: Inputs
) {
    return xs.pipe(
        withLatestFrom(inputs.document$),
        tap(([event, document]) => {
            const elems = document.getElementsByTagName(event.tagName);
            const match = elems[event.index];
            if (match) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(match), 'value').set;
                nativeInputValueSetter.call(match, event.value);
                match.dispatchEvent(new Event('change', { bubbles: true }));
            }
        })
    );
}

export function setElementValue(event: KeyupEvent.IncomingPayload) {
    return [EffectNames.SetElementValue, event];
}
