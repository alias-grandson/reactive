import { ReactiveState, reactive } from './reactive';

enum FunctionStatus {
  Idle,
  Loading,
  Success,
  Error,
}

type FunctionState<T> =
  | {
      status: FunctionStatus.Idle;
    }
  | {
      status: FunctionStatus.Loading;
    }
  | {
      status: FunctionStatus.Success;
      success: true;
      date: T;
    }
  | {
      status: FunctionStatus.Error;
      errors: string[];
      success: false;
    };

function useFunction<T>(method: () => T) {
  let state = new ReactiveState({
    value: {
      status: FunctionStatus.Idle,
    } as FunctionState<T>,
  });
  let reactiveState = reactive(state);

  async function runnerMethod() {
    try {
      reactiveState.value = {
        status: FunctionStatus.Loading,
      };
      reactiveState.value = {
        status: FunctionStatus.Success,
        success: true,
        date: await method(),
      };
    } catch {
      reactiveState.value = {
        status: FunctionStatus.Error,
        errors: ['Error message'],
        success: false,
      };
    }
  }

  return {
    execute: runnerMethod,
    state: reactiveState,
  };
}

const exampleMethod = () => {
  return 'Its data';
};

const exampleFailedMethod = () => {
  throw new Error();
  return 'Its data';
};

const { state, execute } = useFunction(exampleMethod);

execute()
  .then(() => {
    console.log(state.value);
  })
  .catch(() => {
    console.log(state.value);
  });

const { state: filedState, execute: executeFailed } =
  useFunction(exampleFailedMethod);

executeFailed()
  .then(() => {
    console.log(filedState.value);
  })
  .catch(() => {
    console.log(filedState.value);
  });
